import "../styles/me.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Confetti from "canvas-confetti";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'animate.css';
import BottomNavbar from "../components/BottomNavbar"
import { FaSignOutAlt } from 'react-icons/fa'; // Font Awesome se logout icon
import { useNavigate } from "react-router-dom";
import userPng from "../assets/images/user.png";
import { BASE_URL } from "../config";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👁️ Eye icons add kiya

const Me = ({ setUser }) => {
  const [showPassword, setShowPassword] = useState(false); // 👁️ Add state for password visibility
  const navigate = useNavigate();
  const [user, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rewardClaiming, setRewardClaiming] = useState(false);
  // ✅ Added for reset password modal
  const [showResetModal, setShowResetModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);


  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      // const response = await axios.get("http://localhost:5000/api/user/dashboard", {
      const response = await axios.get(`${BASE_URL}/api/user/dashboard`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      // console.log("✅ API Response:", response.data); // 📌 Response log karo
      setUserData(response.data);
    } catch (error) {
      toast.error("Amount load failed!");
    } finally {
      setLoading(false);
    }
  };
  const togglePassword = () => {
    setShowPassword(prev => !prev); // 👁️ Toggle password visibility
  };

  // ✅ Function to handle password reset
  const handleResetPassword = async () => {
    if (!newPassword) return toast.error("Please enter a new password");
    setResetLoading(true);
    try {
      await axios.put(`${BASE_URL}/api/user/reset-password`,
        { password: newPassword },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Password reset successfully!");
      setShowResetModal(false);
      setNewPassword("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Reset failed");
    } finally {
      setResetLoading(false);
    }
  };


  const handleLogout = async () => {
    try {
      // ✅ Call reset-popup API
      // await axios.put("http://localhost:5000/api/user/reset-popup", {}, {
      await axios.put(`${BASE_URL}/api/user/reset-popup`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    } catch (error) {
      console.error("❌ Popup Reset Error:", error.response?.data || error.message);
    }

    // ✅ Clear local storage & redirect
    localStorage.clear();
    setUser(false);
    navigate("/dashboard");
    toast.info("✅ Logged out successfully!");
  };


  const handleClaimReward = async () => {
    if (!user) return;
    setRewardClaiming(true);
    try {
      // const res = await axios.post("http://localhost:5000/api/user/claim-reward", {}, {
      const res = await axios.post(`${BASE_URL}/api/user/claim-reward`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Reward 🎁 Claimed Successfull ✅");
      // ✅ Confetti burst
      Confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });

      await fetchDashboard(); // Refresh user data
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to claim reward");
    } finally {
      setRewardClaiming(false);
    }
  };

  const isRewardEligible = user?.totalEarning >= 100;
  const isRewardClaimed = user?.vipRewardClaimed?.includes(user?.vipLevel);

  if (loading) return <h2>Loading...</h2>;
  return (
    <div className="dashboard-container-main">
      <div className="dashboard-container">
        <div className="header">
          <div className="header-info">
            <div className="user-card">
              <div className="avatar">
                <img src={userPng} alt="avatar" />
              </div>
              <div className="user-info">

                <div className="header-username">{user?.username}</div>
                <div className="header-id">ID: {user?.referralCode}</div>
              </div>
            </div>

            <div className="icons">
              <span>🔔</span>
              <span>🎧</span>
            </div>
          </div>
          <div id="vip-box" className="vip-level">
            {/* <img className="vip-img" src={vip} alt="" /> */}
            {/* <h3>🎖 Your VIP Level</h3> */}


            <p className="level"> <span className="vip-badge">LEVEL {user?.vipLevel}</span></p>
            <p className="level">{user?.nextVipTarget === null
              ? "🎉 Congratulations! All VIP levels completed"
              : `Level ${user?.vipLevel} Target : ${user?.nextVipTarget} USDT`}</p>

            {/* Progress Bar */}
            {user?.nextVipTarget !== null && (
              <>
                <div className="progress-bar">
                  <div className="vip-progress" style={{
                    width: `${(user?.totalEarning / user?.nextVipTarget) * 100}%`,
                  }} />
                </div>
                <p className="totals">{user?.totalEarning} / {user?.nextVipTarget} USDT</p>
              </>
            )}
            {isRewardEligible && (
              <div className="btn-cont">
                <button
                  className={`claim-reward-btn ${isRewardClaimed ? 'disabled' : ''}`}
                  onClick={handleClaimReward}
                  disabled={isRewardClaimed || rewardClaiming}
                >
                  {isRewardClaimed ? "Claimed ✅" : "Claim Reward $5 🎁"}
                </button>
              </div>
            )}

          </div>
        </div>

        <div className="balance-card">
          <div className="balance-info">
            <div className="text-and-button">
              <div className="balance-text">
                <p className="with-depo">● Available Balance (USDT)</p>
                <p className="balance">{user?.wallet}.00</p>
              </div>

              <Link to="/cryptoDeposit" className="deposite-btn"><button className="deposit-btn">Deposit</button></Link>
            </div>
          </div>

          <div className="balance-info">
            <div className="text-and-button">
              <div className="balance-text">
                <p className="with-depo">● Withdraw Balance (USDT)</p>
                <p className="balance">{user?.wallet}.00</p>
              </div>

              <Link to="/withdraw" className="deposite-btn"><button className="withdraw-btn">Withdraw</button></Link>
            </div>
          </div>
          <div className="earnings-card">
            <div className="card-header">My Earnings Investment</div>
            <div className="card-body">
              <div className="card-item">
                <p className="amount1 green">$ {user?.totalEarning}</p>
                <p className="label-title">Total Earnings</p>
              </div>
              <div className="card-item">
                <p className="amount1">$ {user?.investmentWallet}</p>
                <p className="label-title">Total Investment</p>
              </div>
              {/* <div className="card-arrow">➔</div> */}
            </div>
          </div>
        </div>

        <div className="services">
          <h3>My Profile</h3>
          <div className="service-grid">
            <Link to="/transaction" className="service-item">Transaction <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M6 3l5 5-5 5V3z" />
            </svg>
            </Link>
          </div>
          <div className="service-grid">
            <Link to="" className="service-item">VIP Level <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M6 3l5 5-5 5V3z" />
            </svg>
            </Link>
          </div>
          <div className="service-grid">
            <Link to="/profile" className="service-item">About us <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M6 3l5 5-5 5V3z" />
            </svg>
            </Link>
          </div>
          <div className="service-grid">
            <Link to="/taskDuration" className="service-item">Task duration <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M6 3l5 5-5 5V3z" />
            </svg>
            </Link>
          </div>
          <div className="service-grid">
            <button className="logout" onClick={() => setShowResetModal(true)} >Reset Password<FaSignOutAlt className="logout-icon" /></button>
          </div>
          <div className="service-grid">
            <button className="logout" onClick={() => handleLogout()} >  Logout<FaSignOutAlt className="logout-icon" /></button>
          </div>
          {/* ✅ Modal UI for Reset Password */}
          {showResetModal && (
            <div className="reset-password-modal">
              <div className="modal-content">
                <h3>Reset Password</h3>
                {/* <input
                  type="password"
                  className="reset-input"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                /> */}
                <div className=" password-group-me"> {/* 👁️ Wrap for eye icon */}
                  <input
                    type={showPassword ? "text" : "password"} // 👁️ Toggle input type
                    className="reset-input"
                    placeholder="Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}

                  />
                  <span className="toggle-eye-me" onClick={togglePassword}>
                    {showPassword ? <FaEyeSlash className="eye-togle-me" /> : <FaEye className="eye-togle-me" />} {/* 👁️ Show eye or slashed eye */}
                  </span>
                </div>
                <div className="modal-buttons">
                  <button className="reset-btn" onClick={handleResetPassword} disabled={resetLoading}>
                    {resetLoading ? "Resetting..." : "Reset"}
                  </button>
                  <button className="cancel-btn" onClick={() => setShowResetModal(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}





          {/* <div className="icons">
           
          </div> */}




          {/* <div className="tasks-section">
            <h3>Your Tasks</h3>
            {user?.tasks && user.tasks.length > 0 ? (
              user.tasks.map((task) => <TaskProgress key={task._id} task={task} />)
            ) : (
              <p>No tasks found.</p>
            )}
          </div> */}



        </div>

      </div>

      <div className="me-nav">
        <BottomNavbar />
      </div>
    </div>


  );
};

export default Me;




