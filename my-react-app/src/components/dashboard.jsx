import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import AdminNavbar from "./AdminNavbar";

function Dashboard() {

  const navigate = useNavigate();

  return (
    <>
      <AdminNavbar />

      <div className="admin-page">

        <h2 className="admin-title">Admin Dashboard</h2>

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