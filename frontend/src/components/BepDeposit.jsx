

import React, { useState, useEffect } from 'react';
import '../styles/depositPage.css';
import qrImage from "../assets/images/qrcode.jpg";
import binance from "../assets/images/binance.png";
import axios from 'axios';
import logo from "../assets/images/Campa-Logo.svg";
import { BASE_URL } from "../config";

const BepDeposit = () => {
  const walletAddress = '0x72a5f6a32d79f9c53031c3acdde2d2395bb3aab1';
  const coinName = 'USDT (BEP20)';

  const [amount, setAmount] = useState('');
  const [txnId, setTxnId] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [depositHistory, setDepositHistory] = useState([]); // ✅ updated here

  useEffect(() => {
    fetchDeposits(); // ✅ updated here
  }, []);

  const fetchDeposits = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/transactions/history`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // console.log("✅ API response:", response); // Debugging log

      const allDeposits = response?.data?.deposits || []; // Access deposits directly
      const trcDeposits = allDeposits.filter(
        (txn) => txn.method === "BEP20-USDT" // Filter for TRC20 deposits
      );

      setDepositHistory(trcDeposits); // Set TRC20 deposits state
    } catch (err) {
      console.error("❌ Error fetching deposit history", err);
    }
  };


  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    alert('Address copied to clipboard!');
  };

  const handleRecharge = async () => {
    if (!amount || !txnId) {
      alert('Please enter both amount and transaction ID');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/api/deposit/create`, // Static URL here
        {
          username,
          method: 'BEP20-USDT',
          amount,
          txnId,
        }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
      );

      alert(response.data.message || 'Request submitted');
      setUsername('');
      setAmount('');
      setTxnId('');
      fetchDeposits(); // ✅ updated here
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="deposit-container">
      <div className="deposit-card">
        <div className="deposit-header">
          <img src={logo} alt="Company Logo" className="company-logo" />
          <div className="coin-info">
            <img
              src={binance}
              alt="BSC"
              className="coin-icon"
            />
            <span className='trc-span' style={{ fontSize: "11px" }} >{coinName}</span>
          </div>
        </div>

        <div className="qr-section">
          <img src={qrImage} alt="Deposit QR Code" className="qr-image" />

          <p className="address-label">Address</p>
          <div className="instructions">
            <p>1. Copy the address above or scan the QR code and select the BSC (BEP20) network to recharge USDT.</p>
            <p>2. Do not recharge other non-supported assets; the funds will arrive in your account in about 1-3 minutes.</p>
            <p>3. If it does not arrive for a long time, please refresh the page or contact customer service.</p>
          </div>
          <div className="address-box">
            <input className='bep-input' type="text" readOnly value={walletAddress} />
            <button onClick={handleCopy}>Copy</button>
          </div>
        </div>

        {/* 👉 Recharge Form */}
        <div className="form-section">
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='deposit-input'
          />
          <input
            type="number"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className='deposit-input'
          />
          <input
            type="text"
            placeholder="Enter Transaction ID"
            value={txnId}
            onChange={(e) => setTxnId(e.target.value)}
            className='deposit-input'
          />
        </div>

        <button className="recharge-btn" onClick={handleRecharge} disabled={loading}>
          {loading ? 'Submitting...' : 'Recharge completed'}
        </button>

        {/* <div className="instructions">
          <p>1. Copy the address above or scan the QR code and select the BSC (BEP20) network to recharge USDT.</p>
          <p>2. Do not recharge other non-supported assets; the funds will arrive in your account in about 1-3 minutes.</p>
          <p>3. If it does not arrive for a long time, please refresh the page or contact customer service.</p>
        </div> */}
        {/* ✅ Deposit History */}
        <div className="transaction-cards">
          <h4 className='trc-title'>📜 Deposit History (BEP20)</h4>
          {depositHistory.length > 0 ? depositHistory.map((txn) => (
            <div className="withdraw-card" key={txn._id}>
              <div className="card-row">
                <span className="label-withdraw">Amount:</span>
                <span className="deposit-amount">
                  + ${txn.amount}

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
                <span className="label-withdraw">TxID</span>
                <span className="value-withdraw">{txn.txnId}</span>
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
    </div>
  );
};

export default BepDeposit;
