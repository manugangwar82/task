

import React, { useState, useEffect } from "react";
import "../styles/notification.css"; // Make sure this path is correct

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/user/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      // console.log("Fetched Data:", data);

      if (Array.isArray(data)) {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.isRead).length);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    const token = localStorage.getItem("token");
    fetch(`/api/user/notifications/${id}/read`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("Marking read for ID:", id);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(prev - 1, 0));
  };

  // console.log("Marking read for ID:", id);

  return (
    <div className="notification-full-page">
      <h2 className="notification-heading">Notifications   🔔</h2>

      <div className="notification-list-container show">
        <div className="notification-list">
          {notifications.length === 0 ? (
            <p className="no-msg">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`notification-item ${n.isRead ? "read" : "unread"}`}
                onClick={() => markAsRead(n._id)}
              >
                <div className="notification-title">{n.title}</div>
                <div className="notification-message">{n.message}</div>
                <div className="notification-time">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationBell;