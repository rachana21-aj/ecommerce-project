import { useEffect, useState } from "react";
import axios from "axios";
import "./manageorder.css";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

function ManageOrders() {

  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("https://ecommerce-backend-tc76.onrender.com/orders");
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteOrder = async (id) => {
    try {

      await axios.delete(`https://ecommerce-backend-tc76.onrender.com/delete-order/${id}`);

      alert("Order deleted successfully");

      fetchOrders();

    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="manage-container">
        <h2>Manage Orders</h2>

        <div className="table-wrapper">
          <table className="order-table">

            <thead>
              <tr>
                <th>Order ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Payment Method</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>

                  <td>{order._id}</td>
                  <td>{order.fullName}</td>
                  <td>{order.phone}</td>
                  <td>{order.address}</td>
                  <td>₹{order.total}</td>
                  <td>{order.orderStatus}</td>
                  <td>{order.paymentStatus}</td>
                  <td>{order.paymentMethod}</td>

                  <td>
                    {order.orderDate
                      ? new Date(order.orderDate).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td>

                    <button
                      className="delete-btn"
                      onClick={() => deleteOrder(order._id)}
                    >
                      Delete
                    </button>

                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/edit-order/${order._id}`)}
                    >
                      Edit
                    </button>

                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </>
  );
}

export default ManageOrders;