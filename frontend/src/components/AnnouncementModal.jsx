
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/announcementModal.css";

const AnnouncementModal = ({ onClick }) => {
  const [commission, setCommission] = useState(null);
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

  console.log("commission",commission);
  
  return (
    <div className="announcement-overlay">
      <div className="announcement-modal yellow-theme">
        <h2 className="announcement-title">📢 Platform Announcement</h2>
        <div className="announcement-content">
        <p>🎉 Welcome to Campa</p>
          <p>✅ No Minimum Withdrawal </p>
          <p>✅ Long-term platform, never closed</p>
          <p>✅ Instant Task Approval </p>
          <p>✅ Fast Withdrawals (10 mins avg)  </p>
          <p>✅ VIP Level Rewards  </p>
          <p>✅ {commission}% Referral Bonus</p>
          <p>✅ Waiting for you to join!</p>

          
        </div>
        <div className="announcement-footer">
          <button onClick={onClick} className="close-btn">Close</button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementModal;
