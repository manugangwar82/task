

import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👁️ Eye icons add kiya
import "../styles/withdraw.css";

const Withdraw = () => {
  const [showPassword, setShowPassword] = useState(false); // 👁️ Add state for password visibility
  const [user, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState("TRC20-USDT");
  const methods = ["TRC20-USDT", "BEP20-USDT"];

  const [usernameInput, setUsernameInput] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false); // ✅ Popup State
  const [withdrawHistory, setWithdrawHistory] = useState([]); // ✅ updated here
  const commissionRate = 0.03; // ✅ Commission is 3%
  const commission = !isNaN(amount) ? Math.round(Number(amount) * commissionRate) : 0;
  const actualReceived = !isNaN(amount) ? Math.round(Number(amount) - commission) : 0;



  useEffect(() => {
    fetchDashboard();
    fetchWithdrawals(); // ✅ updated here
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`http://${BASE_URL}/api/user/dashboard`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUserData(response.data);
    } catch (error) {
      console.error("❌ Dashboard fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const res = await axios.get(`http://${BASE_URL}/api/transactions/history`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // console.log("✅ API response:", res); // Debugging log
      const allWithdrawals = res?.data?.withdrawals || []; // Access withdrawals directly
      setWithdrawHistory(allWithdrawals); // ✅ updated here
    } catch (err) {
      console.error("Failed to fetch withdrawal history", err);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!usernameInput.trim()) newErrors.usernameInput = "Username is required";
    if (!address.trim()) newErrors.address = "Withdrawal address is required";
    if (!password.trim()) newErrors.password = "Password is required";
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      newErrors.amount = "Enter valid amount";
    } else if (Number(amount) < 20) {
      newErrors.amount = "Minimum withdrawal amount is 20 USDT"; // ✅ Added minimum $60 condition
    } else if (user && Number(amount) > user.wallet) {
      newErrors.amount = "Insufficient balance";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    if (field === "usernameInput") setUsernameInput(value);
    if (field === "address") setAddress(value);
    if (field === "password") setPassword(value);
    if (field === "amount") setAmount(value);

    setErrors((prev) => {
      const updatedErrors = { ...prev };
      if (value.trim() === "") {
        updatedErrors[field] = `${field[0].toUpperCase() + field.slice(1)} is required`;
      } else if (field === "amount" && (isNaN(value) || Number(value) <= 0)) {
        updatedErrors.amount = "Enter valid amount";
      } else {
        delete updatedErrors[field];
      }
      return updatedErrors;
    });
  };
  const togglePassword = () => {
    setShowPassword(prev => !prev); // 👁️ Toggle password visibility
  };
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const res = await axios.post(
        `http://${BASE_URL}/api/withdraw/request`,
        {
          username: usernameInput,
          address,
          method,
          amount: Number(actualReceived), // ✅ Ye line update kari — 3% minus wala amount bhej rahe
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setShowPopup(true); // ✅ Show popup on success
      setTimeout(() => setShowPopup(false), 4000); // Hide after 3 seconds

      setAmount("");
      setAddress("");
      setPassword("");
      setUsernameInput("");
      fetchDashboard(); // Refresh wallet
      fetchWithdrawals(); // ✅ updated here
    } catch (err) {
      // ✅ Handle username/password errors
      if (err.response && err.response.status === 400) {
        const msg = err.response.data?.message || "Something went wrong";

        if (msg.toLowerCase().includes("username")) {
          setErrors((prev) => ({
            ...prev,
            usernameInput: "❌ Invalid username", // ✅ Username invalid error
          }));
        } else if (msg.toLowerCase().includes("password")) {
          setErrors((prev) => ({
            ...prev,
            password: "❌ Invalid password", // ✅ Password invalid error
          }));
        } else {
          alert(msg); // ✅ General error
        }
      } else {
        alert("❌ Failed to submit request");
        console.error(err);
      }
    }
  };
  // console.log("Deposit History:", withdrawHistory);
  return (
    <div className="withdraw-container">
      <h2 className="title">Withdrawal Account</h2>
      <p className="subtitle">24 hours withdrawal</p>

      <div className="balance-box">
        <p className="withdraw-balance">Total Balance</p>
        <h1>{user?.wallet ?? "0.00"} USDT</h1>
      </div>

      <div className="method-section">
        <label>Withdrawal Method:</label>
        <div className="method-buttons">
          {methods.map((m) => (
            <button
              key={m}
              className={method === m ? "active" : ""}
              onClick={() => setMethod(m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Amount</label>
        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => handleInputChange("amount", e.target.value)}
          className="withdraw-input"
        />
        {errors.amount && <span className="error">{errors.amount}</span>}
      </div>

      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          placeholder="Enter Your Username"
          value={usernameInput}
          onChange={(e) => handleInputChange("usernameInput", e.target.value)}
          className="withdraw-input"
        />
        {errors.usernameInput && <span className="error">{errors.usernameInput}</span>}
      </div>

      <div className="form-group">
        <label>Withdrawal Address</label>
        <input
          type="text"
          placeholder="Enter Wallet Address"
          value={address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          className="withdraw-input"
        />
        {errors.address && <span className="error">{errors.address}</span>}
      </div>

      <div className="form-group">
        <label>Password</label>
        {/* <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          className="withdraw-input"
        /> */}
        <div className=" password-group"> {/* 👁️ Wrap for eye icon */}
          <input
            type={showPassword ? "text" : "password"} // 👁️ Toggle input type
            placeholder="Password"
            value={password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className="withdraw-input"
          />
          <span className="toggle-eye" onClick={togglePassword}>
            {showPassword ? <FaEyeSlash className="eye-togle" /> : <FaEye className="eye-togle" />} {/* 👁️ Show eye or slashed eye */}
          </span>
        </div>
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <div className="info-row">
        {/* <span>Fees</span>
        <span>0 USDT (365 free withdrawals)</span> */}
        <span>Commission (3%)</span>
        <span>{commission} USDT</span> {/* ✅ Shows 3% commission */}
      </div>
      <div className="info-row">
        <span>Actually Received</span>
        {/* <span>{amount || 0} USDT</span> */}
        <span>{actualReceived} USDT</span> {/* ✅ Final amount after commission */}

      </div>

      <button className="confirm-btn" onClick={handleSubmit}>
        Confirm
      </button>

      <div className="info-box">
        <h4>About Withdrawal Currencies:</h4>
        <ul>
          <li>Supports TRC20, BEP20.</li>
          <li>Minimum withdrawal to Binance: 10 USDT.</li>
          <li>Withdrawal time: 1–5 minutes, contact support if delayed.</li>
        </ul>
      </div>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>✅ Withdrawal Submitted</h3>
            <p>Your request is being processed.</p>
          </div>
        </div>
      )}

      <div className="transaction-cards">
        <h4 className='withdraw-title'>📜 Withdraw History </h4>
        {withdrawHistory.length > 0 ? withdrawHistory.map((txn) => (
          <div className=" withdraw-card" key={txn._id}>
            <div className="card-row">
              <span className="label-withdraw">Amount:</span>
              <span className="withdraw-amount">
                - ${txn.amount}

              </span>
            </div>
            <div className="card-row">
              <span className="label-withdraw">Method</span>
              <span className="value-withdraw">{txn.method}</span>
            </div>
            <div className="card-row">
              <span className="label-withdraw">Status</span>
              <span className={`value status ${txn.status}`}>{txn.status}</span>
            </div>
            <div className="card-row">
              <span className="label-withdraw">Address</span>
              <span className="value-withdraw">{txn.address}</span>
            </div>

            <div className="card-row">
              <span className="label-withdraw">Date</span>
              <span className="value-withdraw">{new Date(txn.createdAt).toLocaleString()}</span>
            </div>
          </div>
        )) : (
          <p className="no-data">No transactions found</p>
        )}
      </div>
    </div>
  );
};

export default Withdraw;
