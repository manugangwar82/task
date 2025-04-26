

import React, { useEffect, useState } from "react";
import "../styles/depositRequests.css";

const DepositRequests = () => {
    const [requests, setRequests] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Token ko localStorage se fetch karo
    const token = localStorage.getItem("adminToken");

    useEffect(() => {
        fetch("https://task-b1w0.onrender.com/api/admin/deposits", {
            headers: {
                "Authorization": `Bearer ${token}`, // Authorization header mein token bhejein
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                setRequests(data);
                setFiltered(data);
            });
    }, [token]);

    useEffect(() => {
        let result = [...requests];

        if (statusFilter !== "all") {
            result = result.filter(r => r.status === statusFilter);
        }

        if (search.trim()) {
            result = result.filter(r =>
                r.contact.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFiltered(result);
    }, [search, statusFilter, requests]);

    const handleApprove = (id) => {
        if (!window.confirm("Approve this deposit?")) return;

        fetch(`https://task-b1w0.onrender.com/api/admin/deposits/${id}/approve`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`, // Authorization header mein token bhejein
                "Content-Type": "application/json"
            }
        })
            .then(() => {
                alert("Approved ✅");
                setRequests(prev => prev.map(r => r._id === id ? { ...r, status: "approved" } : r));
            });
    };

    const handleReject = (id) => {
        if (!window.confirm("Reject this deposit?")) return;

        fetch(`https://task-b1w0.onrender.com/api/admin/deposits/${id}/reject`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`, // Authorization header mein token bhejein
                "Content-Type": "application/json"
            }
        })
            .then(() => {
                alert("Rejected ❌");
                setRequests(prev => prev.map(r => r._id === id ? { ...r, status: "rejected" } : r));
            });
    };

    // console.log("Deposit Data", filtered);
    return (
        <div className="deposits-container">
            <h2 className="deposits-title">💰 Deposit Requests</h2>
            <div className="filters">
                <input
                    type="text"
                    placeholder="Search by username"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>
            <table className="deposits-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Amount</th>
                        <th>Payment Method</th>
                        <th>TxID</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((req) => (
                        <tr key={req._id}>
                            <td>{req.contact}</td>
                            <td>${req.amount}</td>
                            <td>{req.method}</td>
                            <td>{req.txnId}</td>
                            <td className={`status ${req.status}`}>{req.status}</td>
                            <td>{new Date(req.createdAt).toLocaleString()}</td>
                            <td>
                                {req.status === "pending" && (
                                    <>
                                        <button className="approve-btn" onClick={() => handleApprove(req._id)}>✅Accept</button>
                                        <button className="reject-btn" onClick={() => handleReject(req._id)}>❌Reject</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DepositRequests;
