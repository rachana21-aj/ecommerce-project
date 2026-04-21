import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import "./manageuser.css";

function ManageUser() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://ecommerce-backend-tc76.onrender.com/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="manage-container">
        <h2>Manage Users</h2>

        <table className="manage-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>OTP</th>
              <th>OTP Expiry</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{user.otp}</td>
                <td>{new Date(user.otpExpires).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </>
  );
}

export default ManageUser;