
import React, { useEffect, useState } from "react";
import "../styles/withdrawalRequests.css";

const WithdrawalRequests = () => {
    const [requests, setRequests] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const token = localStorage.getItem("adminToken"); // Assuming the token is stored in localStorage

    useEffect(() => {
        fetch("https://task-b1w0.onrender.com/api/admin/withdrawals", {
            headers: {
                Authorization: `Bearer ${token}` // Include token in header for authentication
            }
        })
            .then(res => res.json())
            .then(data => {
                setRequests(data);
                setFiltered(data);
            })
            .catch((err) => {
                console.error("Error fetching withdrawals", err);
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
        if (!window.confirm("Approve this withdrawal?")) return;

        fetch(`https://task-b1w0.onrender.com/api/admin/withdrawals/${id}/approve`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}` // Include token for authentication
            }
        })
            .then(() => {
                alert("Approved ✅");
                setRequests(prev => prev.map(r => r._id === id ? { ...r, status: "approved" } : r));
            })
            .catch((err) => {
                alert("Error: Unable to approve the request ❌");
                console.error(err);
            });
    };

    const handleReject = (id) => {
        if (!window.confirm("Reject this withdrawal?")) return;

        fetch(`https://task-b1w0.onrender.com/api/admin/withdrawals/${id}/reject`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}` // Include token for authentication
            }
        })
            .then(() => {
                alert("Rejected ❌");
                setRequests(prev => prev.map(r => r._id === id ? { ...r, status: "rejected" } : r));
            })
            .catch((err) => {
                alert("Error: Unable to reject the request ❌");
                console.error(err);
            });
    };

    return (
        <div className="withdrawals-container">
            <h2 className="withdrawals-title">💸 Withdrawal Requests</h2>
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
            <table className="withdrawals-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Amount</th>
                        <th>Wallet Address</th>
                        <th>Status</th>
                        <th>Method</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.length > 0 ? (
                        filtered.map((req) => (
                            <tr key={req._id}>
                                <td>{req.contact}</td>
                                <td>${req.amount}</td>
                                <td>{req.address}</td>
                                <td className={`status ${req.status}`}>{req.status}</td>
                                <td>{req.method}</td>
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
                        ))
                    ) : (
                        <tr><td colSpan={7}>No transactions found</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default WithdrawalRequests;
