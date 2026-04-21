import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../../CartContext";
import "./Checkout.css";

function Checkout() {

  const [products, setProducts] = useState([]);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");

  const { cart } = useContext(CartContext);

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ FIX: handle both direct buy & cart
  const checkoutItems =
    location.state && location.state.product
      ? [
          {
            id: location.state.product._id,
            size: location.state.size,
            quantity: location.state.quantity,
          },
        ]
      : cart;

  useEffect(() => {
    axios.get("http://localhost:3001/products")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  // ✅ FIX: string compare (important)
  const getProduct = (id) => {
    return products.find(p => String(p._id) === String(id));
  };

  // ✅ SUBTOTAL
  const subtotal = checkoutItems.reduce((sum, item) => {
    const product = getProduct(item.id || item._id);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);

  // ✅ GST 18%
  const gst = Math.round(subtotal * 0.18);

  // ✅ FINAL TOTAL
  const total = subtotal + gst;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const userEmail = localStorage.getItem("email");

      if (!userEmail) {
        alert("Please login again");
        return;
      }

      const res = await axios.post("http://localhost:3001/place-order", {
        fullName,
        email: userEmail,
        phone,
        address,
        city,
        state: stateName,
        pincode,

        // ✅ IMPORTANT FIX
        items: checkoutItems.map(item => {
          const product = getProduct(item.id || item._id);

          return {
            name: product?.name,
            price: product?.price,
            quantity: item.quantity,
            size: item.size,
            image: product?.image
          };
        }),

        subtotal,
        gst,
        total,

        payment: "pending",
        paymentStatus: "pending",
        orderStatus: "Placed"
      });

      navigate("/payment", {
        state: {
          orderId: res.data.orderId,
          total: total
        }
      });

    } catch (err) {
      console.log(err);
      alert("Order failed");
    }
  };

  return (
    <div className="checkout-container">

      {/* LEFT */}
      <div className="checkout-left">
        <h2>Checkout</h2>

        <form className="checkout-form" onSubmit={handleSubmit}>

          <h3>Delivery Info</h3>

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <textarea
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          <div className="row">
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="State"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              required
            />
          </div>

          <input
            type="text"
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            required
          />

          <button type="submit" className="place-order-btn">
            Continue to Payment
          </button>

        </form>
      </div>

      {/* RIGHT */}
      <div className="checkout-right">
        <h3>Order Summary</h3>

        {checkoutItems.map(item => {
          const product = getProduct(item.id || item._id);
          if (!product) return null;

          return (
            <div key={(item.id || item._id) + item.size} className="summary-item">
              <div>
                <p className="product-name">{product.name}</p>
                <p>Size: {item.size}</p>
                <p>Qty: {item.quantity}</p>
              </div>

              <p>₹ {product.price * item.quantity}</p>
            </div>
          );
        })}

        <div className="summary-total">
          <p>Subtotal</p>
          <p>₹ {subtotal}</p>
        </div>

        <div className="summary-total">
          <p>GST (18%)</p>
          <p>₹ {gst}</p>
        </div>

        <div className="summary-total final">
          <h4>Total</h4>
          <h4>₹ {total}</h4>
        </div>

      </div>

    </div>
  );
}

export default Checkout;