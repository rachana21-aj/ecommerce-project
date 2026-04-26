require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const ProductSchema = require("./models/Product");
const UserModel = require("./models/User");
const sendMail = require("./mailSender");
const CartSchema = require("./models/Cart");
const Razorpay = require("razorpay");
const upload = require("./config/multer");
const OrderSchema = require("./models/Order");


const app = express();
app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch(err => {
    console.log("MongoDB Error:", err.message);
  });



const Product = mongoose.model("products", ProductSchema);
const Cart = mongoose.model("carts", CartSchema);
const Order = mongoose.model("orders", OrderSchema);

const razorpay = new Razorpay({

  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


app.post("/create-order", async (req, res) => {
try {

const { amount } = req.body;

const options = {
amount: amount * 100,
currency: "INR",
receipt: "receipt_" + Date.now()
};

const order = await razorpay.orders.create(options);

res.json(order);

} catch (err) {
console.log(err);
res.status(500).json({ message: "Failed to create Razorpay order" });
}
});

function generateOTP() {
return Math.floor(1000 + Math.random() * 9000).toString();
}

app.post("/login", async (req, res) => {
try {

const { email } = req.body;

if (!email) {
return res.status(400).json({ error: "Email required" });
}

let user = await UserModel.findOne({ email });

const otp = generateOTP();
const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

if (!user) {
user = await UserModel.create({ email, otp, otpExpires });
} else {
user.otp = otp;
user.otpExpires = otpExpires;
await user.save();
}

await sendMail(
email,
"Your OTP for Login",
`<h2>${otp}</h2><p>This OTP is valid for 5 minutes.</p>`
);

res.json({ message: "OTP generated" });

} catch (err) {
res.status(500).json({ error: "Server error" });
}
});

app.post("/verify-otp", async (req, res) => {
try {

const { email, otp } = req.body;

const user = await UserModel.findOne({ email });

if (!user) return res.status(400).json({ error: "User not found" });
if (user.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });
if (user.otpExpires < new Date())
return res.status(400).json({ error: "OTP expired" });

res.json({ message: "OTP verified successfully", email: user.email });

} catch (err) {
res.status(500).json({ error: "Server error" });
}
});
app.post("/addproduct", upload.single("image"), async (req, res) => {
  try {

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);  

    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      quantity: req.body.quantity,
      category: req.body.category,
      image: req.file ? req.file.path || req.file.secure_url : ""
    });

    const savedProduct = await newProduct.save();

    console.log("SAVED:", savedProduct);

    res.json({ message: "Product added", savedProduct });

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json(err);
  }
});

app.get("/products", async (req, res) => {
try {
const products = await Product.find();
res.json(products);
} catch (err) {
res.status(500).json(err);
}
});

app.delete("/deleteproducts/:id", async (req, res) => {
try {
await Product.findByIdAndDelete(req.params.id);
res.json({ message: "Product deleted" });
} catch (err) {
res.status(500).json(err);
}
});

app.put("/updateproduct/:id", upload.single("image"), async (req, res) => {
try {

const updatedProduct = {
name: req.body.name,
description: req.body.description,
price: req.body.price,
quantity: req.body.quantity,
category: req.body.category
};

if (req.file) {
 updatedProduct.image = req.file.path || req.file.secure_url;   
}

await Product.findByIdAndUpdate(req.params.id, updatedProduct);

res.json({ message: "Product Updated" });

} catch (err) {
res.status(500).json(err);
}
});

app.post("/save-cart", async (req, res) => {
try {

const { userEmail, cart } = req.body;

const formattedItems = cart.map(item => ({
productId: item.id || item._id,
quantity: item.quantity,
size: item.size
}));

let existingCart = await Cart.findOne({ userEmail });

if (existingCart) {
existingCart.items = formattedItems;
await existingCart.save();
} else {
await Cart.create({
userEmail,
items: formattedItems
});
}

res.json({ message: "Cart saved in admin DB" });

} catch (err) {
res.status(500).json(err);
}
});

const PDFDocument = require("pdfkit");

app.post("/place-order", async (req, res) => {
  try {

    const order = new Order({
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      items: req.body.items,
      total: req.body.total,
      payment: req.body.payment,
      paymentStatus: req.body.paymentStatus,
      orderStatus: req.body.orderStatus
    });

    const savedOrder = await order.save();

    
    const doc = new PDFDocument({ size: "A4", margin: 50 });

let buffers = [];
doc.on("data", chunk => buffers.push(chunk));

doc.fontSize(16).text("LimeRoad Pvt Ltd", 50, 50);
doc.fontSize(10).text("Kotekar, Mangalore");
doc.text("Karnataka, India");
doc.text("Email: support@limeroad.com");

doc.fontSize(14).text("OFFICIAL RECEIPT", 400, 50);

doc.moveDown(3);



doc.fontSize(10);
doc.text(`Invoice #: INV-${Date.now()}`, 50, 120);
doc.text(`Order ID: ${savedOrder._id}`);
doc.text(`Date: ${new Date().toLocaleDateString()}`);

doc.text(`Payment: ${req.body.payment}`, 350, 120);
doc.text(`Status: ${req.body.orderStatus}`, 350, 135);



doc.text("Billed To:", 50, 170);
doc.text(req.body.fullName);
doc.text(`${req.body.address}, ${req.body.city}, ${req.body.state}`);



const tableTop = 240;

doc.moveTo(50, tableTop).lineTo(550, tableTop).stroke();
doc.text("Item", 50, tableTop + 5);
doc.text("Qty", 250, tableTop + 5, { width: 40, align: "right" });
doc.text("Price", 300, tableTop + 5, { width: 60, align: "right" });
doc.text("CGST", 370, tableTop + 5, { width: 60, align: "right" });
doc.text("SGST", 430, tableTop + 5, { width: 60, align: "right" });
doc.text("Total", 500, tableTop + 5, { width: 60, align: "right" });

doc.moveTo(50, tableTop + 20).lineTo(550, tableTop + 20).stroke();

let y = tableTop + 30;
let subtotal = 0;

req.body.items.forEach(item => {
  const total = item.price * item.quantity;

  const cgst = total * 0.09;
  const sgst = total * 0.09;

  subtotal += total;

  doc.text(item.name, 50, y, { width: 180 });

doc.text(item.quantity.toString(), 250, y, { width: 40, align: "right" });
doc.text(`₹${item.price.toFixed(2)}`, 300, y, { width: 60, align: "right" });
doc.text(`₹${cgst.toFixed(2)}`, 370, y, { width: 60, align: "right" });
doc.text(`₹${sgst.toFixed(2)}`, 430, y, { width: 60, align: "right" });
doc.text(`₹${total.toFixed(2)}`, 500, y, { width: 60, align: "right" });

  y += 20;
});

doc.moveTo(50, y).lineTo(550, y).stroke();



const totalTax = subtotal * 0.18;
const grandTotal = subtotal + totalTax;

y += 20;

doc.text("Subtotal:", 350, y);
doc.text(`₹${subtotal.toFixed(2)}`, 500, y, { width: 60, align: "right" });

doc.text("GST (18%):", 350, y + 15);
doc.text(`₹${totalTax.toFixed(2)}`, 500, y + 15, { width: 60, align: "right" });

doc.text("Shipping:", 350, y + 30);
doc.text("FREE", 500, y + 30, { width: 60, align: "right" });

doc.text("Grand Total:", 350, y + 50);
doc.text(`₹${grandTotal.toFixed(2)}`, 500, y + 50, { width: 60, align: "right" });



doc.text("Thank you for shopping with LimeRoad!", 50, 750, {
  align: "center"
});
doc.on("end", async () => {
  try {
    const pdfData = Buffer.concat(buffers);

    await sendMail(
      req.body.email,
      "Invoice - Order Confirmation",
      `<h3>Your order is confirmed</h3>
       <p>Order ID: ${savedOrder._id}</p>
       <p>Total: ₹${req.body.total}</p>`,
      {
        content: pdfData.toString("base64"),
        filename: "invoice.pdf",
        type: "application/pdf",
        disposition: "attachment"
      }
    );

    console.log("Invoice mail sent ");

  } catch (err) {
    console.log("Mail error ", err);
  }
});
    doc.end();

res.json({
  message: "Order placed successfully",
  orderId: savedOrder._id
});

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error placing order" });
  }
});

app.put("/update-payment/:orderId", async (req, res) => {
try {

const orderId = req.params.orderId;
const { paymentMethod, status } = req.body;

const updatedOrder = await Order.findByIdAndUpdate(
orderId,
{
paymentMethod: paymentMethod,
paymentStatus: status
},
{ new: true }
);

res.json(updatedOrder);

} catch (err) {
console.log(err);
res.status(500).json({ message: "Payment update failed" });
}
});

app.get("/orders", async (req, res) => {
try {
const orders = await Order.find();
res.json(orders);
} catch (err) {
res.status(500).json({ message: "Error fetching orders" });
}
});
app.delete("/delete-order/:id", async (req, res) => {
  try {
    console.log("Delete request received:", req.params.id);

    await Order.findByIdAndDelete(req.params.id);

    res.json({ message: "Order deleted successfully" });

  } catch (err) {
    console.log("Delete error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

app.put("/update-order/:id", async (req, res) => {
try {

const { status, paymentStatus } = req.body;

const order = await Order.findByIdAndUpdate(
req.params.id,
{
  orderStatus: status,
  paymentStatus: paymentStatus
},
{ new: true }
);

if (!order) {
return res.status(404).json({ message: "Order not found" });
}

if (status === "Shipped") {

await sendMail(
order.email,
"Order Shipped",
`<h3>Your order has been shipped</h3>
<p>Order ID: ${order._id}</p>`
);

}

if (status === "Delivered") {

await sendMail(
order.email,
"Order Delivered",
`<h3>Your order has been delivered</h3>
<p>Order ID: ${order._id}</p>`
);

}

res.json({ message: "Order updated", order });

} catch (err) {

console.log(err);
res.status(500).json({ message: "Error updating order" });

}
});
app.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});
app.get("/my-orders/:email", async (req, res) => {
  try {
    const orders = await Order.find({ email: req.params.email });
    res.json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});
app.post("/get-cart", async (req, res) => {
  try {
    const { userEmail } = req.body;

    const cart = await Cart.findOne({ userEmail });

    if (!cart) {
      return res.json({ items: [] });
    }

    res.json(cart);

  } catch (err) {
    res.status(500).json(err);
  }
});
app.get("/admin/stats", async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    const userCount = await User.countDocuments();

    const orders = await Order.find();

    let revenue = 0;
    orders.forEach(order => {
      revenue += order.total;
    });

    res.json({
      totalProducts: productCount,
      totalOrders: orderCount,
      totalUsers: userCount,
      totalRevenue: revenue
    });

  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});


app.listen(process.env.PORT || 3001, () => {
console.log("Server running");
});