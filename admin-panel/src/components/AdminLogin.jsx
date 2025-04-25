// AdminLogin.js
import { useState } from "react";
import axios from "axios";
import "../styles/adminLogin.css";
import adminLogin from "../assets/images/login.jpg";
import { BASE_URL } from "../config";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = async () => {
    try {
      const res = await axios.post(`http://${BASE_URL}/api/adminAuth/login`, {
        username,
        password,
      });

      localStorage.setItem("adminToken", res.data.token);
      alert("Login Success!");
      window.location.href = "/";
    } catch (err) {
      alert("Login Failed");
      console.log(err.response ? err.response.data : err);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login">
        <img src={adminLogin} alt="" />
      </div>
      <div className="login-card">
        <h2>Admin Login</h2>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <button onClick={loginHandler}>Login</button>
      </div>
    </div>
  );
}

export default AdminLogin;
