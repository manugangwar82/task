import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "../styles/bottomNavbar.css";
import { useLocation } from "react-router-dom";
const BottomNavbar = () => {
  const location = useLocation();
  const activePage = location.pathname; // Current URL path

  return (
      <div className="bottom-navbar">
          <Link to="/dashboard" className={`nav-item ${activePage === "/dashboard" ? "active" : ""}`}>
               Home
          </Link>
          <Link to="/tasklist" className={`nav-item ${activePage === "/tasklist" ? "active" : ""}`}>
               Task
          </Link>
          <Link to="/leaderboard" className={`nav-item ${activePage === "/leaderboard" ? "active" : ""}`}>
              Leaderboard
          </Link>
          <Link to="/referralSystem" className={`nav-item ${activePage === "/referralSystem" ? "active" : ""}`}>
             Invite
          </Link>
          <Link to="/me" className={`nav-item ${activePage === "/me" ? "active" : ""}`}>
               Me
          </Link>
      </div>
  );
}
export default BottomNavbar