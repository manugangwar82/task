

import React from "react";
import "../styles/announcementModal.css";

const AnnouncementModal = ({ onClick }) => {
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
          <p>✅ 10% Referral Bonus</p>
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
