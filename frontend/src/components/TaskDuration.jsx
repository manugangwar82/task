import axios from "axios";
import React, { useEffect, useState } from "react";
import TaskProgress from "../components/TaskProgress"



const TaskDuration = () => {
    const [user, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchDashboard = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/user/dashboard", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          console.log("✅ API Response:", response.data); // 📌 Response log karo
          setUserData(response.data);
        } catch (error) {
          toast.error("Amount load failed!");
        } finally {
          setLoading(false);
        }
      };
  
      fetchDashboard();
    }, []);
    return (
        <div className="tasks-section">
            <h3>Your Tasks</h3>
            {user?.tasks && user.tasks.length > 0 ? (
                user.tasks.map((task) => <TaskProgress key={task._id} task={task} />)
            ) : (
                <p>No tasks found.</p>
            )}
        </div>
    )
}
export default TaskDuration;