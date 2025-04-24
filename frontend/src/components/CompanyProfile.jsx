import React from "react";
import profile from "../assets/images/profile.jpg";
import "../styles/companyProfile.css";


const CompanyProfile = () => {
    return (
      <div className="company-profile-wrapper">
        <div className="company-profile-glass">
          <div className="company-image-section">
            <img
              src={profile} // Change this to your actual image path
              alt="Campa Company Banner"
              className="company-banner"
            />
          </div>
  
          <div className="company-content">
            <h1 className="company-title">
              Welcome to <span className="highlight">Campa</span>
            </h1>
            <p className="company-tagline">
              Daily Earning, Real Rewards. Start Your Income Journey Today!
            </p>
  
            <div className="company-section">
              <h2>🌟 About Campa</h2>
              <p>
                Campa is a future-ready platform where micro-tasks turn into daily income.
                Secure, transparent, and reliable — Campa is built for those who dream big and start small.
              </p>
            </div>
  
            <div className="company-section">
              <h2>🚀 Our Mission</h2>
              <p>
                We aim to simplify earning opportunities and bring financial freedom to everyone.
                Campa is not just an app, it's a movement to empower digital earners worldwide.
              </p>
            </div>
  
            <div className="company-section">
              <h2>💡 Why Choose Campa?</h2>
              <ul>
                <li>✅ Simple & Profitable Daily Tasks</li>
                <li>✅ Multi-Level Referral Income</li>
                <li>✅ VIP Upgrade Rewards</li>
                <li>✅ Wallet System with Transparency</li>
                <li>✅ Instant Withdrawals</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default CompanyProfile;