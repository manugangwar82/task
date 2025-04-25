import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/referralSystem.css";
import { toast } from "react-toastify";
import Referral from "../assets/images/open.png";
import BottomNavbar from "../components/BottomNavbar"
import { BASE_URL } from "../config";

const ReferralSystem = ({ referralCode }) => {
  const [commission, setCommission] = useState(null);
  const [referralData, setReferralData] = useState({
    referralWallet: 0,
    totalEarning: 0,
    referredUsers: [],
  });

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        // const response = await axios.get("http://localhost:5000/api/auth/referral-data", {
        const response = await axios.get(`http://${BASE_URL}/api/auth/referral-data`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        // console.log("referral dat", response.data);
        setReferralData(response.data);

      } catch (error) {
        console.error("Error fetching referral data:", error);
      }
    };

    fetchReferralData();
    
  }, []);
  // console.log("referral dat", referralData);


  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // const response = await axios.get("http://localhost:5000/api/user/dashboard", {
        const response = await axios.get(`http://${BASE_URL}/api/user/dashboard`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        // console.log("📡 API Response:", response.data); // ✅ Check API response
        setUser(response.data);

      } catch (error) {
        console.error("❌ API Error:", error.response ? error.response.data : error.message);
        toast.error("Dashboard load failed!");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  useEffect(() => {
    const fetchCommission = async () => {
      try {
        const res = await axios.get("/api/referral/settings");
        setCommission(res.data.referralRewardPercent); // ✅ Referral percent
      } catch (err) {
        console.error("Error fetching referral commission:", err);
      }
    };

    fetchCommission();
  }, []);

  const copyReferral = () => {
    const referralLink = `${window.location.origin}/signup?ref=${user?.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied!");
  };
  
  const copyInvitationcode = () => {
    navigator.clipboard.writeText(`${user?.referralCode}`);
    toast.success("Refer code copied!");
    // alert("Referral code copied!")
  };
  // console.log("comission", commission);
  // console.log("comission", user);

  return (
    <div className="referral-wrapper">
    <div className="referral-card">
      <div className="ref-section">
        <h2 className="ref-title">Refer a friend and get commission {commission}%</h2>
        <img className="ref-img" src={Referral} alt="" />
  
        <div className="section">
          <label>Invitation Code:</label>
          <div className="inline-row">
            <span className="code">{`${user?.referralCode}`}</span>
            <button onClick={copyInvitationcode}>Copy</button>
          </div>
        </div>
  
        <div className="section">
          <label>Invite Your Friend and Earn Money ...</label>
          <div className="inline-row">
            <span className="link">{`${window.location.origin}/signup?ref=${user?.referralCode}`}</span>
            <button onClick={copyReferral}>Copy</button>
          </div>
        </div>
      </div>
  
      <div className="share-buttons">
        <button
          className="share-btn whatsapp"
          onClick={() => {
            const link = `${window.location.origin}/signup?ref=${user?.referralCode}`;
            window.location.href = `https://wa.me/?text=${encodeURIComponent( `Earn ${commission}% by joining this platform! ${link}`)}`;
          }}
        >
          WhatsApp
        </button>
  
        <button
          className="share-btn twitter"
          onClick={() => {
            const link = `${window.location.origin}/signup?ref=${user?.referralCode}`;
            window.location.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
             `Earn ${commission}% by joining this platform! ${link}`
            )}`;
          }}
        >
          Twitter
        </button>
  
        <button
          className="share-btn instagram"
          onClick={() => {
            window.location.href = "https://www.instagram.com/";
          }}
        >
          Instagram
        </button>
      </div>
  
      <div className="stats">
        <h3>Team Stats</h3>
        <div className="stat-boxes">
          <div className="stat-card">
            <p className="stat-title">Team Income</p>
            <p className="stat-value">${referralData.referralWallet}</p>
          </div>
          <div className="stat-card">
            <p className="stat-title">Total Earning</p>
            <p className="stat-value">${referralData.totalEarning}</p>
          </div>
          <div className="stat-card">
            <p className="stat-title">Team Withdrawal</p>
            <p className="stat-value">${referralData.totalTeamWallet}.00</p>
          </div>
          <div className="stat-card">
            <p className="stat-title">New Team</p>
            <p className="stat-value">0</p>
          </div>
          <div className="stat-card">
            <p className="stat-title">First Recharge</p>
            <p className="stat-value">0</p>
          </div>
          <div className="stat-card">
            <p className="stat-title">First Withdrawal</p>
            <p className="stat-value">0</p>
          </div>
        </div>
      </div>
  
      <div className="referred-users">
        <h3>Referred Users</h3>
        {referralData.referredUsers.length > 0 ? (
          <ul className="referred-list">
            {referralData.referredUsers.map((user) => (
              <li key={user._id} className="referred-user-card">
                <div className="user-info">
                  <span className="username">{user.username}</span>
                  <span className="email">{user.email}</span>
                </div>
                <div className="joined-date">
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                  <p className="team-withdraw">Total Withdraw: ${user.wallet}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-referrals">No users referred yet.</p>
        )}
      </div>
    </div>
  
    <div className="ref-nav">
      <BottomNavbar />
    </div>
  </div>
  
  );
};
export default ReferralSystem;
