import React, { useEffect, useState } from "react";
import "../styles/rechargeNotifications.css";

const demoData = [
  { mobile: "79****4669", time: "15:09:54", amount: "$800", status: "Success" },
  { mobile: "89****6568", time: "04:10:23", amount: "$3,000", status: "Success" },
  { mobile: "98****1815", time: "11:12:45", amount: "$2,000", status: "Success" },
  { mobile: "76****8945", time: "09:15:32", amount: "$3,500", status: "Success" },
  { mobile: "88****2374", time: "15:18:41", amount: "$120", status: "Success" },
  { mobile: "82****7671", time: "15:18:21", amount: "$1200", status: "Success" },
  { mobile: "72****7311", time: "01:18:51", amount: "$100", status: "Success" },
  { mobile: "74****2398", time: "02:10:23", amount: "$1000", status: "Success" },
  { mobile: "82****9874", time: "18:16:11", amount: "$300", status: "Success" },
  { mobile: "89****4323", time: "19:18:31", amount: "$250", status: "Success" },
  { mobile: "84****4544", time: "21:02:21", amount: "$500", status: "Success" },
];

const RechargeNotifications = () => {
  const [notifications, setNotifications] = useState(demoData);

  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((prev) => [...prev.slice(1), prev[0]]);
    }, 3000); // हर 3 सेकंड में नया scroll effect

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="recharge-container">
      <div className="recharge-list">
        {notifications.map((item, index) => (
          <div key={index} className="recharge-item">
            <span className="speaker-icon">🔊</span>
            <span className="mobile">{item.mobile}</span>
            <span className="time">{item.time}</span>
            <span className="amount">{item.amount}</span>
            <span className="status">{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RechargeNotifications;
