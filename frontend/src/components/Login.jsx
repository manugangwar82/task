import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";
import axios from "axios";
import login from "../assets/images/login.jpg";
import { BASE_URL } from "../config";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👁️ Eye icons add kiya

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // Error state
  const [loading, setLoading] = useState(false); // Loading state
  const [showPassword, setShowPassword] = useState(false); // 👁️ Add state for password visibility
  // const navigate = useNavigate(); // ✅ Redirect करने के लिए

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePassword = () => {
    setShowPassword(prev => !prev); // 👁️ Toggle password visibility
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset previous error
    setLoading(true);
    try {
      // const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      const res = await axios.post(`http://${BASE_URL}/api/auth/login`, formData);

      // ✅ Token और User Data LocalStorage में Save करो
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ Global state को update करो
      if (setUser) {
        setUser(res.data.user);
      }

      // alert("Login Successful");
      toast.success("Login Successful ✅ ");

      // ⏳ Thoda time deke redirect karwao
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500); // 1.5 sec me redirect hoga

    } catch (err) {
      console.log("❌ Login Error:", err);

      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-main-cont">
      <div className="signup-img1">
        <img src={login} alt="" />
      </div>
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>

          <div className="input-group">
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          </div>

          <div className="input-group password-group"> {/* 👁️ Wrap for eye icon */}
            <input
              type={showPassword ? "text" : "password"} // 👁️ Toggle input type
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <span className="toggle-eye" onClick={togglePassword}>
              {showPassword ? <FaEyeSlash className="eye-togle"/> : <FaEye className="eye-togle"/>} {/* 👁️ Show eye or slashed eye */}
            </span>
          </div>
          {error && <p className="login-error">{error}</p>}

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
