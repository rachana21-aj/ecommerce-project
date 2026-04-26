import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./dashboard.css";
import AdminNavbar from "./AdminNavbar";

function Dashboard() {

  const navigate = useNavigate();

  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);

  useEffect(() => {
  fetchStats();
  fetchOrders();

  const interval = setInterval(() => {
    fetchStats();
    fetchOrders();
  }, 5000); 

  return () => clearInterval(interval);
}, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("https://ecommerce-backend-tc76.onrender.com/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("https://ecommerce-backend-tc76.onrender.com/admin/recent-orders");
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="dashboard-container">

        <h2>Welcome to Admin Dashboard</h2>

        <div className="stats-cards">

          <div className="card">
            <p>{stats.totalProducts || 0}</p>
            <span>Total Products</span>
          </div>

          <div className="card">
            <p>{stats.totalOrders || 0}</p>
            <span>Total Orders</span>
          </div>

          <div className="card">
            <p>{stats.totalUsers || 0}</p>
            <span>Users</span>
          </div>

          <div className="card">
            <p>₹{stats.totalRevenue || 0}</p>
            <span>Revenue</span>
          </div>

        </div>

       
        <div className="orders-box">
          <h3>Recent Orders</h3>

          {orders.map(order => (
            <div className="order-row" key={order._id}>
              <span>{order._id.slice(-6)}</span>
              <span>₹{order.total}</span>
              <span>{order.orderStatus}</span>
            </div>
          ))}
        </div>

        
        <div className="admin-buttons">

          <button onClick={() => navigate("/addproduct")}>
            Add Product
          </button>

          <button onClick={() => navigate("/manageproduct")}>
            Manage Product
          </button>

          <button onClick={() => navigate("/manageorder")}>
            Manage Order
          </button>

          <button onClick={() => navigate("/manageuser")}>
            Manage User
          </button>

        </div>

      </div>
    </>
  );
}

export default Dashboard;