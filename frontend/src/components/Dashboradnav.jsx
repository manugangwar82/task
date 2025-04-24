import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboardnav.css";

const menuItems = [
  { icon: "🎁", label: "App" },
  { icon: "💰", label: "Deposit" },
  { icon: "🏢", label: "Profile" },
  { icon: "🤑", label: "Withdraw" }
];

const Dashboardnav = () => {
const navigate = useNavigate();

  const handleClick = (label) => {
    if (label === "Withdraw") {
      navigate("/withdraw"); 
    }else if (label === "Deposit") {
      navigate("/cryptoDeposit"); 
    }else if (label === "Profile") {
      navigate("/profile");
    }
  };

  return (
    <div className="menu-container">
      {menuItems.map((item, index) => (
        <div key={index} className="menu-item" onClick={() => handleClick(item.label)}>
          <div className="icon">{item.icon}</div>
          <span className="nav-span">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Dashboardnav;
