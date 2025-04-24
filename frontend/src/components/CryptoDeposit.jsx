import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/cryptoDeposit.css";
import tether from "../assets/images/tetherusdt.png";
import binance from "../assets/images/binance.png";
import trxNetwork from "../assets/images/trxnetwork.png";

const cryptoList = [
  {
    name: 'TRC20-USDT',
    // usdtIcon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
    networkIcon: trxNetwork,
  },
  {
    name: 'BEP20-USDT',
    // usdtIcon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
    networkIcon: binance,
  },
];

const CryptoOptions = () => {
  const navigate = useNavigate();

  const handleClick = (coinName) => {
    const encoded = encodeURIComponent(coinName);
    navigate(`/deposit/${encoded}`);
  };

  return (
    <div className="crypto-container">
      <div className="crypto-card-list">
        {cryptoList.map((item, index) => (
          <button
            key={index}
            className="crypto-card"
            onClick={() => handleClick(item.name)}
          >
            <div className="icon-wrapper">
              <img
                src={tether}
                alt="USDT"
                className="crypto-icon-img usdt-icon"
              />
              <img
                src={item.networkIcon}
                alt={item.name}
                className="crypto-icon-img network-icon"
              />
            </div>
            <span className="crypto-name">{item.name}</span>
            <span className="arrow">{'>'}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CryptoOptions;
