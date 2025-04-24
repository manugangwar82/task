// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import '../styles/transactionHistory.css';

// const TransactionHistory = () => {
//   const [deposits, setDeposits] = useState([]);
//   const [withdrawals, setWithdrawals] = useState([]);
//   const [activeTab, setActiveTab] = useState('deposits');

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem("token");

//       try {
//         const res = await axios.get('/api/transactions/history', {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         setDeposits(res.data.deposits);
//         setWithdrawals(res.data.withdrawals);
//       } catch (err) {
//         console.error("Error fetching transaction history:", err);
//       }
//     };

//     fetchData();
//   }, []);

//   console.log("Deposite", deposits);
//   console.log("Withdraw", withdrawals);

//   const renderTable = (data) => (
//     <table className="transaction-table">
//       <thead>
//         <tr>
//           <th>Amount</th>
//           <th>Method</th>
//           <th>Status</th>
//           <th>Address</th>
//           <th>Date</th>
//         </tr>
//       </thead>
//       <tbody>
//         {data.length > 0 ? data.map((item) => (
//           <tr key={item._id}>
//             <td>${item.amount}</td>
//             <td>{item.method}</td>
//             <td className={item.status}>{item.status}</td>
//             <th>{item.address}</th>
//             <td>{new Date(item.createdAt).toLocaleString()}</td>
//           </tr>
//         )) : (
//           <tr><td colSpan="4">No transactions found</td></tr>
//         )}
//       </tbody>
//     </table>
//   );

//   return (
//     <div className="transaction-container">
//       <div className="tabs">
//         <button onClick={() => setActiveTab('deposits')} className={activeTab === 'deposits' ? 'active' : ''}>Deposits</button>
//         <button onClick={() => setActiveTab('withdrawals')} className={activeTab === 'withdrawals' ? 'active' : ''}>Withdrawals</button>
//       </div>

//       <div className="table-section">
//         {activeTab === 'deposits' ? renderTable(deposits) : renderTable(withdrawals)}
//       </div>
//     </div>
//   );
// };

// export default TransactionHistory;





// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import '../styles/transactionHistory.css';

// const TransactionHistory = () => {
//     const [deposits, setDeposits] = useState([]);
//     const [withdrawals, setWithdrawals] = useState([]);
//     const [activeTab, setActiveTab] = useState('deposits');

//     useEffect(() => {
//         const fetchData = async () => {
//             const token = localStorage.getItem("token");

//             try {
//                 const res = await axios.get('/api/transactions/history', {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });

//                 setDeposits(res.data.deposits);
//                 setWithdrawals(res.data.withdrawals);
//             } catch (err) {
//                 console.error("Error fetching transaction history:", err);
//             }
//         };

//         fetchData();
//     }, []);

//     console.log("Deposite", deposits);
//     console.log("Withdraw", withdrawals);

//     const renderTable = (data, type) => (
//         <table className="transaction-table">
//             <thead>
//                 <tr>
//                     <th>Amount</th>
//                     <th>Method</th>
//                     <th>Status</th>
//                     {type === 'withdrawals' && <th>Address</th>}
//                     {type === 'deposits' && <th>TxID</th>}
//                     <th>Date</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {data.length > 0 ? data.map((item) => (
//                     <tr key={item._id}>
//                         <td>${item.amount}</td>
//                         <td>{item.method}</td>
//                         <td className={item.status}>{item.status}</td>
//                         {type === 'withdrawals' && <td>{item.address}</td>}
//                         {type === 'deposits' && <td>{item.txnId}</td>}
//                         <td>{new Date(item.createdAt).toLocaleString()}</td>
//                     </tr>
//                 )) : (
//                     <tr><td colSpan={type === 'withdrawals' ? 5 : 5}>No transactions found</td></tr>
//                 )}
//             </tbody>
//         </table>
//     );

//     return (
//         <div className="transaction-container">
//             <div className="tabs">
//                 <button
//                     onClick={() => setActiveTab('deposits')}
//                     className={activeTab === 'deposits' ? 'active' : ''}
//                 >
//                     Deposits
//                 </button>
//                 <button
//                     onClick={() => setActiveTab('withdrawals')}
//                     className={activeTab === 'withdrawals' ? 'active' : ''}
//                 >
//                     Withdrawals
//                 </button>
//             </div>

//             <div className="table-section">
//                 {activeTab === 'deposits'
//                     ? renderTable(deposits, 'deposits')
//                     : renderTable(withdrawals, 'withdrawals')}
//             </div>
//         </div>
//     );
// };

// export default TransactionHistory;





import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/transactionHistory.css';

const TransactionHistory = () => {
    const [deposits, setDeposits] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);
    const [activeTab, setActiveTab] = useState('deposits');

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get('/api/transactions/history', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDeposits(res.data.deposits);
                setWithdrawals(res.data.withdrawals);
            } catch (err) {
                console.error("Error fetching transaction history:", err);
            }
        };
        fetchData();
    }, []);

    const renderCards = (data, type) => (
        <div className="transaction-cards">
            {data.length > 0 ? data.map((item) => (
                <div className="transaction-card-item" key={item._id}>
                    <div className="card-row">
                        <span className="label">Amount:</span>
                        <span className={`value amount ${type}`}>
                            {type === 'deposits' ? '+' : '-'} ${item.amount}
                        </span>
                    </div>
                    <div className="card-row">
                        <span className="label">Method</span>
                        <span className="value">{item.method}</span>
                    </div>
                    <div className="card-row">
                        <span className="label">Status</span>
                        <span className={`value status ${item.status}`}>{item.status}</span>
                    </div>
                    {type === 'withdrawals' && (
                        <div className="card-row">
                            <span className="label">Address</span>
                            <span className="value">{item.address}</span>
                        </div>
                    )}
                    {type === 'deposits' && (
                        <div className="card-row">
                            <span className="label">TxID</span>
                            <span className="value">{item.txnId}</span>
                        </div>
                    )}
                    <div className="card-row">
                        <span className="label">Date</span>
                        <span className="value">{new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                </div>
            )) : (
                <p className="no-data">No transactions found</p>
            )}
        </div>
    );

    return (
        <div className="transaction-container">
            <div className="transaction-card">
                <h2 className="transaction-title">Transaction History</h2>

                <div className="tabs">
                    <button
                        className={activeTab === 'deposits' ? 'active' : ''}
                        onClick={() => setActiveTab('deposits')}
                    >
                        Deposits
                    </button>
                    <button
                        className={activeTab === 'withdrawals' ? 'active' : ''}
                        onClick={() => setActiveTab('withdrawals')}
                    >
                        Withdrawals
                    </button>
                </div>

                {activeTab === 'deposits'
                    ? renderCards(deposits, 'deposits')
                    : renderCards(withdrawals, 'withdrawals')}
            </div>
        </div>
    );
};

export default TransactionHistory;
