
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';

import "../styles/usersManagement.css";
const BASE_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:5000"
  : "https://task-b1w0.onrender.com";

axios.defaults.baseURL = BASE_URL;


const UsersManagement = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState("");

    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showTreeModal, setShowTreeModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);

    const [walletAmount, setWalletAmount] = useState(0);
    const [vipLevel, setVipLevel] = useState(1);
    const [isBanned, setIsBanned] = useState(false);
    const [referralTree, setReferralTree] = useState([]);

    const [resetPassword, setResetPassword] = useState("");
    // console.log("user data", users);
    console.log("user data", filteredUsers);
    useEffect(() => {
        const token = localStorage.getItem("adminToken");

        fetch("/api/admin/users", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                setFilteredUsers(data);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
                if (error.message.includes("401")) {
                    // Unauthorized error
                    navigate("/login");
                }
            });
    }, []);

    useEffect(() => {
        const lower = search.toLowerCase();
        const filtered = users.filter(
            user =>
                user.username.toLowerCase().includes(lower) ||
                user.email.toLowerCase().includes(lower)
        );
        setFilteredUsers(filtered);
    }, [search, users]);

    const handleView = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setWalletAmount(user.wallet);
        setVipLevel(user.vipLevel);
        setIsBanned(user.isBanned || false);
        setShowEditModal(true);
    };
    const handleSaveButton = () => {
        const token = localStorage.getItem("adminToken"); // Token ko fetch karen
        // Wallet amount ko current wallet amount ke saath add karen
        const updatedWalletAmount = selectedUser.wallet + walletAmount;

        fetch(`/api/admin/user/${selectedUser._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, // Token ko Authorization header mein bhejein
            },
            body: JSON.stringify({
                wallet: updatedWalletAmount,
                vipLevel: vipLevel,
                isBanned: isBanned,
            }),
        })
            .then((res) => res.json())
            .then(() => {
                // alert("User updated successfully ✅");
                toast.success("User updated successfully ✅");
                closeEditModal();
                return fetch("/api/admin/users", {
                    headers: {
                        "Authorization": `Bearer ${token}`, // Token ko yahan bhi add karein
                    },
                });
            })
            .then((res) => res.json())
            .then((data) => {
                setUsers(data);
                setFilteredUsers(data);
            })
            .catch((err) => {
                console.error("Update Error:", err);
                alert("Something went wrong!");
            });
    };
    const handleReferralTree = (userId) => {
        fetch(`/api/admin/user/${userId}/referral-tree`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log("Referral Tree Data: ", data);
                setReferralTree(Array.isArray(data) ? data : [data]);
                setShowTreeModal(true);
            });
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            fetch(`/api/admin/user/${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                }
            })
                .then(res => res.json())
                .then(() => {
                    // alert("User deleted ❌");
                    toast.success("User deleted ❌");

                    setUsers(prev => prev.filter(u => u._id !== userId));
                    setFilteredUsers(prev => prev.filter(u => u._id !== userId));
                });
        }
    };

    const handleResetPassword = (userId) => {
        setSelectedUser({ _id: userId });
        setShowResetModal(true);
    };

    const submitResetPassword = () => {
        if (!resetPassword || resetPassword.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        fetch(`/api/admin/user/${selectedUser._id}/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("adminToken")}`
            },
            body: JSON.stringify({ newPassword: resetPassword }),
        })
            .then(res => res.json())
            .then(() => {
                // alert("Password reset successfully ✅");
                toast.success("Password reset successfully ✅");
                setShowResetModal(false);
                setResetPassword("");
                setSelectedUser(null);
            })
            .catch((err) => {
                console.error("Reset Error:", err);
                alert("Password reset failed ❌");
            });
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setSelectedUser(null);
    };

    const closeTreeModal = () => {
        setShowTreeModal(false);
        setReferralTree([]);
    };

    const renderTree = (nodes) => {
        if (!Array.isArray(nodes)) {
            return <p>No referral data available.</p>;
        }

        // console.log("user data", users);

        return (
            <ul className="tree-container">
                {nodes.map((node) => (
                    <li key={node._id}>
                        <div className="tree-node">
                            <span className="tree-username">{node.username}</span>
                            <span className="tree-vip">VIP {node.vipLevel}</span>
                        </div>
                        {node.referrals?.length > 0 && renderTree(node.referrals)}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="users-container">
            <div className="user-top-cont">
                <h2 className="users-title">👥 Users Management</h2>
                <button className="save-btn" onClick={() => navigate("/withdraw")}>
                    Withdraw
                </button>
                <button className="save-btn" onClick={() => navigate("/deposit")}>
                    Deposit
                </button>
                <button className="save-btn" onClick={() => navigate("/task")}>
                    Task Management
                </button>
                <button className="save-btn" onClick={() => navigate("/refer")}>
                    Refer
                </button>
                <button className="save-btn" onClick={() => navigate("/broadcast")}>
                    broadcast
                </button>
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                />
            </div>
            <div className="table-wrapper">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Id</th>
                            <th>Email</th>
                            <th>Wallet</th>
                            <th>Wallet</th>
                            <th>VIP</th>
                            <th>Referral Code</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((u) => (
                            <tr key={u._id}>
                                <td>{u.username}</td>
                                <td>{u._id}</td>
                                <td>{u.email}</td>
                                <td>${u.wallet}</td>
                                <td>VIP {u.vipLevel}</td>
                                <td>{u.referralCode}</td>
                                <td>
                                    <button className="view-btn" onClick={() => handleView(u)}>👁 View</button>
                                    <button className="edit-btn" onClick={() => handleEdit(u)}>✏️</button>
                                    <button className="tree-btn" onClick={() => handleReferralTree(u._id)}>🌳 Referrals</button>
                                    <button className="delete-btn" onClick={() => handleDeleteUser(u._id)}>🗑 Delete</button>
                                    <button className="reset-btn" onClick={() => handleResetPassword(u._id)}>🔑 Reset Password</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && selectedUser && (
                <div className="modal-overlay">
                    <div className="modal-box glass-effect">
                        <h3 className="modal-title">👁 User Details</h3>
                        <div className="modal-content">
                            <p><span>Name:</span> {selectedUser.username}</p>
                            <p><span>Email:</span> {selectedUser.email}</p>
                            <p><span>Wallet:</span> ${selectedUser.wallet}</p>
                            <p><span>VIP Level:</span> {selectedUser.vipLevel}</p>
                            <p><span>Referral Code:</span> {selectedUser.referralCode}</p>
                            <p><span>Total Earning:</span> ${selectedUser.totalEarning}</p>
                        </div>
                        <button className="close-btn" onClick={closeModal}>✖ Close</button>
                    </div>
                </div>
            )}

            {showEditModal && selectedUser && (
                <div className="modal-overlay">
                    <div className="modal-box edit-modal glass-effect">
                        <h3 className="modal-title">✏️ Edit User</h3>
                        <label>Wallet Amount:</label>
                        <input
                            type="number"
                            value={walletAmount ?? ""}
                            onChange={(e) => {
                                const val = e.target.value;
                                setWalletAmount(val === "" ? "" : parseFloat(val));
                            }}
                        />
                        <label>VIP Level:</label>
                        <input
                            type="number"
                            value={vipLevel ?? ""}
                            onChange={(e) => {
                                const val = e.target.value;
                                setVipLevel(val === "" ? "" : parseInt(val));
                            }}
                        />

                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={isBanned}
                                onChange={(e) => setIsBanned(e.target.checked)}
                            />
                            &nbsp;Ban/Suspend User
                        </label>
                        <div className="modal-buttons">
                            <button className="save-btn" onClick={handleSaveButton}>💾 Save Changes</button>
                            <button className="close-btn" onClick={closeEditModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {showTreeModal && (
                <div className="modal-overlay">
                    <div className="modal-box glass-effect">
                        <h3 className="modal-title">🌳 Referral Tree</h3>
                        <div className="modal-content">
                            {renderTree(referralTree)}
                        </div>
                        <button className="close-btn" onClick={closeTreeModal}>✖ Close</button>
                    </div>
                </div>
            )}

            {showResetModal && selectedUser && (
                <div className="modal-overlay">
                    <div className="modal-box glass-effect">
                        <h3 className="modal-title">🔑 Reset Password</h3>
                        <label>New Password:</label>
                        <input
                            type="password"
                            className="modal-input"
                            value={resetPassword}
                            onChange={(e) => setResetPassword(e.target.value)}
                        />
                        <div className="modal-buttons">
                            <button className="save-btn" onClick={submitResetPassword}>💾 Reset</button>
                            <button className="close-btn" onClick={() => setShowResetModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersManagement;
