import React from "react";
// import "./Wallet.css";

const  Wallet = ({ balance}) => {
  // console.log("Wallet Balance:", balance); // Debugging
  return (
    <div className="wallet">
      <h2>$ {balance}</h2>
    </div>
  );
};

export default Wallet;