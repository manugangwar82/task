

import React, { useState, useEffect } from "react";
import "../styles/broadcast.css";


const BroadcastMessage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch("https://task-b1w0.onrender.com/api/admin/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  useEffect(() => {
    if (selectedUser && selectedUser !== "all") {
      fetch(`https://task-b1w0.onrender.com/api/admin/notifications/${selectedUser}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setNotifications(data));
    } else {
      setNotifications([]);
    }
  }, [selectedUser]);

  const sendNotification = async () => {
    const target = selectedUser === "all" ? "all" : selectedUser;
    const res = await fetch(`https://task-b1w0.onrender.com/api/admin/notifications/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
      body: JSON.stringify({ userId: target, title, message }),
    });

    const data = await res.json();
    setStatus(data.message || "Notification sent!");
    setMessage("");
    setTitle("");

    if (selectedUser !== "all") {
      const refreshed = await fetch(`https://task-b1w0.onrender.com/api/admin/notifications/${selectedUser}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setNotifications(await refreshed.json());
    }
  };

  const deleteNotification = async (notificationId) => {
    const url = `https://task-b1w0.onrender.com/api/admin/notifications/${notificationId}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });

    const data = await res.json();
    setStatus(data.message || "Deleted successfully");
    setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
  };

  const deleteAllNotifications = async () => {
    const url =
      selectedUser === "all"
        ? `https://task-b1w0.onrender.com/api/admin/notifications/delete-all`
        : `https://task-b1w0.onrender.com/api/admin/notifications/user/${selectedUser}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });

    const data = await res.json();
    setStatus(data.message || "Deleted all successfully");

    if (selectedUser !== "all") setNotifications([]);
  };

  return (
    <div className="notification-container">
      <h2>📣 Notification Manager</h2>

      <div className="notification-form">
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Select User</option>
          <option value="all">All Users</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.username}
            </option>
          ))}
        </select>

        <input
          type="text"
          className="broadcast-input"
          placeholder="Enter notification title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Enter notification message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>

        <button onClick={sendNotification} disabled={!selectedUser || !title || !message}>
          Send Notification
        </button>

        {selectedUser && (
          <div className="delete-section">
            <button onClick={deleteAllNotifications}>
              {selectedUser === "all" ? "Delete Notifications for All Users" : "Delete All Notifications"}
            </button>
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="notification-list">
          <h4>📬 Notifications:</h4>
          {notifications.map((n) => (
            <div key={n._id} className="notification-item">
              <strong>{n.title}</strong>
              <p>{n.message}</p>
              <button onClick={() => deleteNotification(n._id)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {status && <p className="status">{status}</p>}
    </div>
  );
};

export default BroadcastMessage;
