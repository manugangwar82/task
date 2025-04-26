

import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "./config";
import { ToastContainer } from 'react-toastify';  // 👈 Import karo react-toastify se
import 'react-toastify/dist/ReactToastify.css';   // 👈 Isko bhi mat bhoolna
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import Me from "./components/Me";
import TaskList from "./components/TaskList";
import Leaderboard from "./components/Leaderboard";
import TaskProgress from "./components/TaskProgress"
import TaskDuration from "./components/TaskDuration"
import ReferralSystem from "./components/ReferralSystem"
import CryptoDeposit from "./components/CryptoDeposit"
import BepDeposit from "./components/BepDeposit"
import TrcDeposit from "./components/TrcDeposit"
import Withdraw from "./components/Withdraw"
import TransactionHistory from "./components/TransactionHistory";
import CompanyProfile from "./components/CompanyProfile";
import Notification from "./components/NotificationBell";
import "./index.css";
// import User from "../../backend/backend/models/User";

function App() {
  // const [unreadCount, setUnreadCount] = useState(0);  // ✅ Added unreadCount state here
  // const [user, setUser] = useState(() => {
  //   return localStorage.getItem("token") ? true : false;  // ✅ Refresh hone par bhi login bana rahe
  // });

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     setUser(true);
  //   }
  // }, []);

  // const [user, setUser] = useState(null);  // default null
  // const [loading, setLoading] = useState(true); // loading state

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     setUser(true);
  //   } else {
  //     setUser(false);
  //   }
  //   setLoading(false);
  // }, []);

  // if (loading) return <div>Loading...</div>; // Ya koi spinner


  const [user, setUser] = useState(null);  // default null
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(true);
      fetchDashboard();  // Fetch dashboard data after token check
    } else {
      setUser(false);
    }
    // setLoading(false);
  }, []);
  
  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/user/dashboard`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUser(response.data);
     
    } catch (error) {
      console.error("❌ Dashboard Error:", error);
      // toast.error("Dashboard load failed!");
    } 
  };
  // console.log("userrr", user);
  
  

  return (
    <Router>
      <Routes>
        {/* Agar user login hai to / pe direct dashboard dikhaye */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Signup />} />

        {/* Agar user login hai to login pe direct dashboard dikhaye */}
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />

        {/* Dashboard sirf login users ke liye */}
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/me" element={<Me setUser={setUser} />} />
        <Route path="/tasklist" element={<TaskList user={user} setUser={setUser} />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/taskProgress" element={<TaskProgress />} />
        <Route path="/taskDuration" element={<TaskDuration />} />
        <Route path="/referralSystem" element={<ReferralSystem />} />
        <Route path="/cryptoDeposit" element={<CryptoDeposit />} />
        <Route path="/deposit/BEP20-USDT" element={<BepDeposit />} />
        <Route path="/deposit/TRC20-USDT" element={<TrcDeposit />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/transaction" element={<TransactionHistory />} />
        <Route path="/profile" element={<CompanyProfile />} />
        {/* <Route path="/notification" element={<Notification />} /> */}
        // Pass user._id to NotificationBell
        <Route path="/notification" element={<Notification/>  } />
        {/* <Route path="/notification" element={<Notification/>  } /> */}

      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="custom-toast"
        toastClassName="custom-toast-body"
      />
    </Router>

  );
}

export default App;
