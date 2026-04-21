import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = () => {

    
    if (email === "admin@gmail.com" && password === "admin123") {
      alert("Admin Login Successful");
      navigate("/dashboard");
    } else {
      alert("Invalid Admin Email or Password");
    }

  };

  return (
    <div className="login-page">
      <div className="login-box">

        <h2>ADMIN LOGIN</h2>

        <label>Admin Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleAdminLogin}>
          LOGIN
        </button>

      </div>
    </div>
  );
}

export default Admin;