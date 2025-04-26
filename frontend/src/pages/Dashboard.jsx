import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DailyTasks from "../components/DailyTasks";
import BottomNavbar from "../components/BottomNavbar"
import LandingPage from "../components/LandingPage"
import Dashboardnav from "../components/Dashboradnav"
import ScrollingTextComponent from "../components/ScrollingTextComponent"
import RechargeNotifications from "../components/RechargeNotifications"
import AnnouncementModal from "../components/AnnouncementModal"; // ⬅️ NEW
import TaskHall from "../components/TaskHall"
import "../styles/bottomNavbar.css";
import "../styles/dashboard.css";
import { FaWallet } from "react-icons/fa";
import { MdNotificationsActive } from "react-icons/md";
import { BASE_URL } from "../config";
import logo from "../assets/images/Campa-Logo.svg";
import { useNavigate } from "react-router-dom";

 axios.defaults.baseURL = BASE_URL;


// import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnnouncement, setShowAnnouncement] = useState(true); // ⬅️ NEW
  const [unreadCount, setUnreadCount] = useState(0); // 🆕 Unread notification count


  useEffect(() => {
    fetchDashboard();
    fetchUnreadCount(); // 🆕 Fetch unread count initially
  }, []);

  const fetchDashboard = async () => {
    try {
      // const response = await axios.get("http://localhost:5000/api/user/dashboard", {
      const response = await axios.get(`${BASE_URL}/api/user/dashboard`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      // console.log("📡 API Response:", response.data); // ✅ Check API response
      // console.log("📡 API Response:", response.data.popupDismissed); // ✅ Check API response
      setUser(response.data);
      if (response.data.popupDismissed === false) {
        // console.log("✅ Setting showAnnouncement: TRUE");
        setShowAnnouncement(true);
      } else {
        // console.log("✅ Setting showAnnouncement: FALSE");
        setShowAnnouncement(false);
      }
    } catch (error) {
      console.error("❌ Dashboard Error:", error);
      toast.error("Dashboard load failed!");
    } finally {
      setLoading(false);
    }
  };


  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://task-b1w0.onrender.com/api/user/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      const count = Array.isArray(data)
        ? data.filter((n) => !n.isRead).length
        : 0;
      setUnreadCount(count); // 🆕 Set unread count
    } catch (error) {
      console.error("❌ Unread count fetch error:", error);
    }
  };


  const handleClosePopup = async () => {
    try {
      const response = await axios.put( // 👈 yeh missing tha
        // "http://localhost:5000/api/user/dismiss-popup",
        `${BASE_URL}/api/user/dismiss-popup`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      // console.log("✅ Popup dismiss response:", response.data);
      setShowAnnouncement(false);
    } catch (error) {
      toast.error("Failed to dismiss popup");
    }
  };


  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="dashboard">
      {showAnnouncement && <AnnouncementModal onClick={handleClosePopup} />}
      <div className="dashboard-header">
        {/* <h1>🌙 moonAi</h1> */}
        <img src={logo} alt="" />
        <div className="dash-header">

          <div className="dashboard-price">
            <p className="dashboard-wallet" >$ {user?.wallet}.00</p>
            <FaWallet className="wallet-icon"/>
          </div>
          <div className="dash-announce" onClick={() => navigate("/notification")} style={{ position: "relative" }}> {/* 🔧 ye update kiya hai */}
            <MdNotificationsActive className="dash-announce1" />
            {unreadCount > 0 && <span className="red-dot" />} {/* 🆕 Red dot */}
          </div>
        </div>
      </div>
      <ScrollingTextComponent />
      <LandingPage />
      <RechargeNotifications />
      <Dashboardnav />
      <TaskHall />
      <DailyTasks user={user} setUser={setUser} />


      {/* <ReferralSystem referralCode={user?.referralCode} /> */}
      <BottomNavbar />

    </div>
  );
};

export default Dashboard;
