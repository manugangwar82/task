import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config";
import TaskProgress from "../components/TaskProgress";
import "../styles/TaskDuration.css"; // ✅ External CSS

const TaskDuration = () => {
  const [user, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/user/dashboard`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        console.log("✅ API Response:", response.data);
        setUserData(response.data);
      } catch (error) {
        console.error("Amount load failed!", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="task-duration-container">
      <div className="task-duration-wrapper">
        <h2 className="task-heading">🗓️ Your Active Tasks</h2>
        {loading ? (
          <p className="task-loading">Loading...</p>
        ) : user?.tasks && user.tasks.length > 0 ? (
          user.tasks.map((task) => (
            <div className="task-card-d" key={task._id}>
              <TaskProgress task={task} />
            </div>
          ))
        ) : (
          <p className="task-empty">No tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default TaskDuration;
