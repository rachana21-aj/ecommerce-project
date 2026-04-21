import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import validator from "validator";
import "./login.css";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (value) => {
    if (!validator.isEmail(value)) {
      setEmailError("Enter valid Email!");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) return;

    try {
      await axios.post("https://ecommerce-backend-tc76.onrender.com/login", { email });

      
      navigate("/otp", { state: { email } });

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>SIGN IN</h2>
        <p className="sub">sign in to proceed further</p>

        <label>Enter the email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {emailError && <p className="error">{emailError}</p>}

        <button type="button" onClick={handleSubmit}>
          NEXT
        </button>
        <p>
        <Link to="/admin">Are you an admin?</Link>
      </p>
      </div>
    </div>
  );
}

export default Login;