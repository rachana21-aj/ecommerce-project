import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./signup.css";

function Signup() {

const location = useLocation();
const email = location.state?.email;

const [otp, setOtp] = useState("");
const [error, setError] = useState("");

const navigate = useNavigate();

const handleVerify = async () => {


try {

  const res = await axios.post(
    "https://ecommerce-backend-tc76.onrender.com/verify-otp",
    { email, otp }
  );

  
  localStorage.setItem("email", res.data.email);

  navigate("/");

} catch (err) {

  setError(err.response?.data?.error || "Verification failed");

}


};

const handleResend = async () => {


try {

  await axios.post("https://ecommerce-backend-tc76.onrender.com/resend-otp", { email });
  alert("OTP resent successfully");

} catch (err) {

  console.log(err);

}


};

return (


<div className="login-page">

  <div className="login-box">

    <h2>VERIFY OTP</h2>

    <p>OTP sent to: {email}</p>

    <input
      type="text"
      placeholder="Enter OTP"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
    />

    {error && <p className="error">{error}</p>}

    <button onClick={handleVerify}>VERIFY</button>

    <button onClick={handleResend}>RESEND OTP</button>

  </div>

</div>


);

}

export default Signup;
