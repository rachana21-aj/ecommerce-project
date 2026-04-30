import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./dashboard.css";
import AdminNavbar from "./AdminNavbar";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { BarChart, Bar } from "recharts";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

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

 
  const chartData = orders
    .slice(0, 7)
    .reverse()
    .map(order => ({
      date: new Date(order.orderDate).toLocaleDateString(),
      revenue: order.total
    }));
    const statusData = [
  {
    name: "Delivered",
    value: orders.filter(o => o.orderStatus === "Delivered").length
  },
  {
    name: "Pending",
    value: orders.filter(o => o.orderStatus === "Placed").length
  }
];

const COLORS = ["#00C49F", "#FFBB28"];
const monthlyData = orders.map(order => ({
  month: new Date(order.orderDate).toLocaleString("default", { month: "short" }),
  orders: 1
}));


const groupedMonthly = Object.values(
  monthlyData.reduce((acc, curr) => {
    if (!acc[curr.month]) {
      acc[curr.month] = { month: curr.month, orders: 0 };
    }
    acc[curr.month].orders += 1;
    return acc;
  }, {})
);
const orderTrendData = orders
  .slice(0, 7)
  .reverse()
  .map(order => ({
    date: order.orderDate
      ? new Date(order.orderDate).toLocaleDateString()
      : "N/A",
    orders: 1
  }));


const groupedOrdersTrend = Object.values(
  orderTrendData.reduce((acc, curr) => {
    if (!acc[curr.date]) {
      acc[curr.date] = { date: curr.date, orders: 0 };
    }
    acc[curr.date].orders += 1;
    return acc;
  }, {})
);

  return (
    <>
      <AdminNavbar />

      <div className="dashboard-wrapper">

        
        <div className="sidebar">
          <p className="active">Dashboard</p>
          <p onClick={() => navigate("/addproduct")}>Add Product</p>
          <p onClick={() => navigate("/manageproduct")}>Manage Product</p>
          <p onClick={() => navigate("/manageorder")}>Manage Orders</p>
          <p onClick={() => navigate("/manageuser")}>Manage Users</p>
        </div>

        
        <div className="dashboard-main">

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

        
        <div className="bottom-section">
          <div className="chart-box">
            <h3>Revenue Trend (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="pie-box">
            <h3>Order Status</h3>
            <PieChart width={250} height={250}>
              <Pie data={statusData} dataKey="value" outerRadius={80}>
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </div>
        </div>

       
        <div className="chart-box">
          <h3>Monthly Orders</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={groupedMonthly}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        
        <div className="chart-box">
          <h3>Orders Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={groupedOrdersTrend}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#4CAF50" />
            </LineChart>
          </ResponsiveContainer>
        </div>

      
        <div className="orders-box">
          <h3>Recent Orders</h3>
          {orders.map(order => (
            <div className="order-row" key={order._id}>
              <span>{order._id.slice(-6)}</span>
              <span>₹{order.total}</span>
              <span className={`status ${order.orderStatus}`}>
                {order.orderStatus}
              </span>
            </div>
          ))}
        </div>

      </div> 

    </div> 
  </>
);

}

export default Dashboard;