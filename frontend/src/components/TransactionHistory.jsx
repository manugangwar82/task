
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
