import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditOrder.css";

function EditOrder() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [orderStatus, setOrderStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    getOrder();
  }, []);

  const getOrder = async () => {
    try {

      const res = await axios.get("https://ecommerce-backend-tc76.onrender.com/orders");

      const order = res.data.find((o) => o._id === id);

      if(order){
        setOrderStatus(order.orderStatus);
        setPaymentStatus(order.paymentStatus);
      }

    } catch (err) {
      console.log(err);
    }
  };

const updateOrder = async () => {

  try {

    await axios.put(`https://ecommerce-backend-tc76.onrender.com/update-order/${id}`, {
      status: orderStatus,
      paymentStatus: paymentStatus
    });

    alert("Order updated");

    navigate("/manageorder");

  } catch (err) {
    console.log(err);
  }

};

  return (

    <div className="edit-page">

      <div className="edit-container">

        <h2>Edit Order</h2>

        <div className="form-group">
          <label>Order Status</label>

          <select
            value={orderStatus}
            onChange={(e) => setOrderStatus(e.target.value)}
          >
            <option>Pending</option>
            <option>Placed</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>

        </div>

        <div className="form-group">

          <label>Payment Status</label>

          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
          >
            <option>Pending</option>
            <option>Completed</option>
          </select>

        </div>

        <button className="update-btn" onClick={updateOrder}>
          Update Order
        </button>

      </div>

    </div>

  );
}

export default EditOrder;