import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Task1 from "../assets/images/task0.webp";
import Task2 from "../assets/images/task1.webp";
import Task3 from "../assets/images/task2.webp";
import Task4 from "../assets/images/task3.webp";
import Task5 from "../assets/images/task4.webp";
import Task6 from "../assets/images/task5.webp";
import Task7 from "../assets/images/task6.webp";
import Task8 from "../assets/images/task7.webp";
import "../styles/dailyTask.css";
import { BASE_URL } from "../config";


const DailyTasks = ({ user, setUser }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [taskErrors, setTaskErrors] = useState({});
  const [boughtTasks, setBoughtTasks] = useState(new Set());
  const taskImages = [Task1, Task2, Task3, Task4, Task5, Task6, Task7, Task8];
  
  // ✅ Server से Tasks लाओ

  const fetchTasks = async () => {
    try {
      // const response = await axios.get("http://localhost:5000/api/tasks");
      const response = await axios.get(`${BASE_URL}/api/tasks`);
      // console.log("📡 Server से मिला Data:", response.data);
      // 👉 Sirf Active tasks ko UI me set karo
      const activeTasks = response.data.filter(task => task.isActive);
      // console.log("📡 Server :", activeTasks);
      setTasks(activeTasks);
    } catch (error) {
      console.error("❌ Tasks fetch करने में error:", error);
      toast.error("❌ Tasks load करने में असमर्थ");
    }
  };

  const fetchUserTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // const response = await axios.get("http://localhost:5000/api/user-tasks", {
      const response = await axios.get(`${BASE_URL}/api/user-tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // console.log("✅ User Tasks Fetched:", response.data);

      setUser((prev) => ({
        ...prev,
        wallet: response.data.wallet,
        tasks: response.data.tasks,
      }));

      const boughtSet = new Set(response.data.tasks.map((t) => t._id));
      setBoughtTasks(boughtSet);
    } catch (error) {
      console.error("❌ User Tasks fetch करने में error:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUserTasks();
  }, [setUser]);

  // ✅ Task खरीदने का Logic
  const buyTask = async (taskId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("❌ Unauthorized: कृपया login करें।");
      return;
    }

    setLoading(true);
    setTaskErrors((prev) => ({ ...prev, [taskId]: "" }));

    try {
      const response = await axios.post(
        // "http://localhost:5000/api/buy-task",
        `${BASE_URL}/api/buy-task`,
        { taskId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // console.log("✅ Task खरीदा:", response.data);
      toast.success(response.data.message);

      if (!response.data.tasks) {
        console.error("❌ Server से tasks नहीं मिले:", response.data);
        toast.error("❌ Server ने invalid data return किया!");
        return;
      }

      setUser((prev) => ({
        ...prev,
        wallet: response.data.wallet,
        tasks: response.data.tasks,
      }));

      setBoughtTasks((prev) => new Set([...prev, taskId]));
    } catch (error) {
      const errorMsg = error.response?.data?.message || "❌ Task खरीदने में असमर्थ";
      setTaskErrors((prev) => ({ ...prev, [taskId]: errorMsg }));
      toast.error(errorMsg);
    }
    setLoading(false);
  };

  return (
    <div className="task-container">

      {/* <button
        className="refresh-btn"
        onClick={() => {
          console.log("🔁 Refresh button clicked");
          fetchTasks();
          fetchUserTasks();
        }}
      >
        🔁 
      </button> */}

      {/* <h2 className="title">🛍️ Available Tasks</h2> */}
      <div className="task-grid">
        {tasks.length === 0 ? (
          <p>⏳ Tasks load हो रहे हैं...</p>
        ) : (
          tasks.map((task, index) => {
            const isPurchased = boughtTasks.has(task._id);
            const taskImg = taskImages[index % taskImages.length];

            // console.log(`🔍 Task ID: ${task._id} - Purchased: ${isPurchased}`);

            return (
              <div className="task-card" key={task._id}>
                <img src={taskImg} alt="Product" />


                <div className="plan-details">
                  <div className="detail">
                    <p> Price</p>
                    <h3>{task.price} USDT</h3>
                  </div>
                  <div className="detail">
                    <p> Daily Profit</p>
                    <h3>{task.dailyProfit} USDT</h3>
                  </div>
                  <div className="detail">
                    <p> Total Profit</p>
                    <h3>{task.totalProfit} USDT</h3>
                  </div>
                  <div className="detail">
                    <p>Duration</p>
                    <h3>{task.duration} days</h3>
                  </div>
                </div>

                {taskErrors[task._id] && <div className="error-message">❌ {taskErrors[task._id]}</div>}

                {!isPurchased ? (
                  <button className="buy-btn" onClick={() => buyTask(task._id)} disabled={loading}>
                    {loading ? "⏳ Buying..." : "🛒 Buy Task"}
                  </button>
                ) : (
                  <button className="buy-btn purchased" disabled>
                    ✅ Purchased
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DailyTasks;
