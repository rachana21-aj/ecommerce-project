import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Payment.css";

function Payment() {

const location = useLocation();
const navigate = useNavigate();
const [paymentMethod, setPaymentMethod] = useState("cod");
const [orderId, setOrderId] = useState("");
const [total, setTotal] = useState(0);
useEffect(() => {
if (location.state && location.state.orderId) {
  setOrderId(location.state.orderId);
  setTotal(location.state.total);
} 
else {
  navigate("/checkout");
}
}, []);
const handlePayment = async () => {
try {
  if (paymentMethod === "cod") {

    await axios.put(`http://localhost:3001/update-payment/${orderId}`, {
      paymentMethod: "cod",
      status: "pending"
    });
    navigate("/ordersuccess", { state: { orderId } });
  }
 else {
    const res = await axios.post("http://localhost:3001/create-order", {
      amount: total
    });
    const order = res.data;
    const options = {
      key: "rzp_test_SaZRDP5eDTZsI3",
      amount: order.amount,
      currency: "INR",
      order_id: order.id,

      handler: async function () {

        await axios.put(`http://localhost:3001/update-payment/${orderId}`, {
          paymentMethod: "razorpay",
          status: "Paid"
        });
        navigate("/ordersuccess", { state: { orderId } });

      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  }

} catch (err) {
  console.log(err);
  alert("Payment failed");
}
};
return (
<div className="payment-container">
<h2>Payment</h2>
<p>Total Amount: ₹ {total}</p>
<label>
<input
type="radio"
value="cod"
checked={paymentMethod === "cod"}
onChange={(e) => setPaymentMethod(e.target.value)}
/>
Cash on Delivery
</label>
<br />
<label>
<input
type="radio"
value="online"
checked={paymentMethod === "online"}
onChange={(e) => setPaymentMethod(e.target.value)}
/>
Online Payment
</label>
<br /><br />
<button onClick={handlePayment}>
Place Order
</button>
</div>
);
}

export default Payment;