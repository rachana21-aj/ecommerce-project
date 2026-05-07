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
app.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;

    await user.save();

    await sendMail(
      email,
      "Your Resent OTP",
      `<h2>${otp}</h2><p>This OTP is valid for 5 minutes.</p>`
    );

    res.json({ message: "OTP resent successfully" });

  } catch (err) {
    console.log(err);
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
  subCategory: req.body.subCategory, // ✅ ADD THIS
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
  category: req.body.category,
  subCategory: req.body.subCategory // ✅ ADD THIS
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



doc.image("assets/logo.png", 50, 45, { width: 60 });


doc.rect(40, 40, 520, 80).stroke();


doc.fontSize(14).text("LimeRoad Pvt Ltd", 120, 50);
doc.fontSize(10).text("Kotekar, Mangalore", 120, 65);
doc.text("Karnataka, India", 120, 78);
doc.text("Email: support@limeroad.com", 120, 91);


doc.font("Helvetica-Bold").fontSize(14).text("OFFICIAL RECEIPT", 400, 50);
doc.font("Helvetica");


const formattedDate = new Date().toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric"
});

doc.fontSize(10);
doc.text(`Invoice #: INV-${Date.now()}`, 350, 80);
doc.text(`Order ID: ${savedOrder._id}`, 350, 95);
doc.text(`Date: ${formattedDate}`, 350, 110);


doc.moveDown(2);
doc.text(`Payment: ${req.body.payment}`, 50, 140);
doc.text(`Status: ${req.body.orderStatus}`, 200, 140);
doc.text("Shipping: Standard Delivery", 350, 140);
doc.text("Shipping Cost: FREE", 350, 155);

let billY = 180;

doc.fontSize(12).font("Helvetica-Bold").text("Billed To:", 50, billY);

doc.fontSize(10).font("Helvetica");


doc.text(req.body.fullName, 50, billY + 20);


doc.text(req.body.address, 50, billY + 40, {
  width: 220,
  lineGap: 4
});


doc.text(`${req.body.city}, ${req.body.state}`, 50, billY + 80);


const tableTop = 260;

doc.rect(50, tableTop, 500, 20).fillAndStroke("#eeeeee", "#000");

doc.fillColor("#000").fontSize(10);
doc.text("Item", 55, tableTop + 5);
doc.text("Qty", 250, tableTop + 5);
doc.text("Price", 300, tableTop + 5);
doc.text("CGST", 360, tableTop + 5);
doc.text("SGST", 420, tableTop + 5);
doc.text("Total", 480, tableTop + 5);


let y = tableTop + 30;
let subtotal = 0;

req.body.items.forEach(item => {
  const total = item.price * item.quantity;
  const cgst = total * 0.09;
  const sgst = total * 0.09;

  subtotal += total;

  doc.text(item.name, 55, y, { width: 150 });
  doc.text(item.quantity.toString(), 250, y);
  doc.text(`Rs ${item.price.toFixed(2)}`, 300, y);
  doc.text(`Rs ${cgst.toFixed(2)}`, 360, y);
  doc.text(`Rs ${sgst.toFixed(2)}`, 420, y);
  doc.text(`Rs ${total.toFixed(2)}`, 480, y);

  y += 20;
});


doc.moveTo(50, y).lineTo(550, y).stroke();


const totalTax = subtotal * 0.18;
const grandTotal = subtotal + totalTax;

y += 20;

doc.text("Subtotal:", 350, y);
doc.text(`Rs ${subtotal.toFixed(2)}`, 480, y);

doc.text("GST (18%):", 350, y + 15);
doc.text(`Rs ${totalTax.toFixed(2)}`, 480, y + 15);

doc.text("Shipping:", 350, y + 30);
doc.text("FREE", 480, y + 30);

doc.fontSize(12).text("Grand Total:", 350, y + 50);
doc.fontSize(12).text(`Rs ${grandTotal.toFixed(2)}`, 480, y + 50);


doc.fontSize(10).text(
  "Thank you for shopping with LimeRoad!",
  50,
  750,
  { align: "center" }
);
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
    const products = await Product.find();
    const orders = await Order.find();
    const users = await UserModel.find();   

    console.log("Products:", products.length);
    console.log("Orders:", orders.length);
    console.log("Users:", users.length);

    res.json({
      totalProducts: products.length,
      totalOrders: orders.length,
      totalUsers: users.length,
      totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0)
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});
app.get("/admin/recent-orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ orderDate: -1 })
      .limit(50);

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recent orders" });
  }
});


app.listen(process.env.PORT || 3001, () => {
console.log("Server running");
});