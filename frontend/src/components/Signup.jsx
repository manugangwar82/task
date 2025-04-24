
import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom"; // ✅ URL Params लेने के लिए
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import "../styles/signup.css";
import signup from "../assets/images/login.jpg";
import { BASE_URL } from "../config";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👁️ Eye icons add kiya

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false); // 👁️ Add state for password visibility
  const navigate = useNavigate();
  const [serror, setErrorr] = useState(""); // Error state
  const [searchParams] = useSearchParams(); // ✅ URL से referral code लेने के लिए
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    referralCode: "",
  });

  // ✅ URL से referral code fetch करके state में set करना
  useEffect(() => {
    const refCode = searchParams.get("ref"); // URL से referral code निकालना
    if (refCode) {
      setFormData((prev) => ({ ...prev, referralCode: refCode }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const togglePassword = () => {
    setShowPassword(prev => !prev); // 👁️ Toggle password visibility
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorr(""); // Reset error

    try {
      await axios.post(`http://${BASE_URL}/api/auth/signup`, formData);
      // alert("Signup Successful! Now login.");
      toast.success("Signup Successful ✅ ! Now login. ");
      // ⏳ Thoda time deke redirect karwao
      setTimeout(() => {
        navigate("/login"); // ✅ Redirect to login page
      }, 1500); // 1.5 sec me redirect hoga

    } catch (err) {
      if (err.response && err.response.data.message) {
        const msg = err.response.data.message;

        // 🔹 Specific error messages handle karo
        if (msg.includes("Username")) {
          setErrorr("Username already taken. Please choose a different one.");
        } else if (msg.includes("Email")) {
          setErrorr("This email is already registered. Try logging in.");
        } else if (msg.includes("Password")) {
          setErrorr("Password must be at least 6 characters.");
        } else {
          setErrorr("Something went wrong. Please try again.");
        }
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="signup-img">
        <img src={signup} alt="" />
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Sign Up</h2>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <div className=" password-group"> {/* 👁️ Wrap for eye icon */}
          <input
            type={showPassword ? "text" : "password"} // 👁️ Toggle input type
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <span className="toggle-eye" onClick={togglePassword}>
            {showPassword ? <FaEyeSlash className="eye-togle" /> : <FaEye className="eye-togle" />} {/* 👁️ Show eye or slashed eye */}
          </span>
        </div>
        {/* ✅ Referral Code Auto-Fill */}
        <input
          type="text"
          name="referralCode"
          placeholder="Referral Code (Optional)"
          value={formData.referralCode}
          onChange={handleChange}
          readOnly={!!formData.referralCode} // अगर URL से आया है तो readonly कर दो
        />
        {serror && <p className="signup-error">{serror}</p>}
        <button type="submit">Sign Up</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
