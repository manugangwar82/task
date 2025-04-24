import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { FaWallet } from "react-icons/fa";
import Task1 from "../assets/images/task0.png";
import Task2 from "../assets/images/task1.png";
import Task3 from "../assets/images/task2.png";
import Task4 from "../assets/images/task3.png";
import Task5 from "../assets/images/task4.png";
import Task6 from "../assets/images/task5.png";
import Task7 from "../assets/images/task6.png";
import Task8 from "../assets/images/task7.png";
import "../styles/taskList.css";
import { CiWallet } from "react-icons/ci";
import BottomNavbar from "../components/BottomNavbar"

const TaskList = ({ user, setUser }) => {
  console.log("🟢 TaskList Props:", { user, setUser });
  const [boughtTasks, setBoughtTasks] = useState([]); // ✅ Default Empty Array
  const [timers, setTimers] = useState({}); // ✅ Task Timers
  const priceToImageMap = {
    20: Task1,
    60: Task2,
    100: Task3,
    300: Task4,
    500: Task5,
    1000: Task6,
    1500: Task7,
    2000: Task8,
  };


  // ✅ **Auto Fetch Purchased Tasks on Component Mount**
  useEffect(() => {
    fetchUserTasks();
  }, []);

  const fetchUserTasks = async () => {
    try {
      // console.log("🟢 Fetching User Tasks...");

      // ✅ Token LocalStorage से लो
      const token = localStorage.getItem("token");
      // console.log("🟢 Token from LocalStorage:", token);

      const res = await axios.get("/api/user-tasks", {
        withCredentials: true, // ✅ Cookies भी भेजो
        headers: { Authorization: `Bearer ${token}` }, // ✅ Token Header में भेजो
      });

      // console.log("🔹 API Response:", res.data);
      // console.log("🔹 API Response URL:", res.request.responseURL);

      if (res.data && Array.isArray(res.data.tasks)) {
        setBoughtTasks(res.data.tasks);

        const newTimers = {};
        res.data.tasks.forEach((task) => {
          if (task.nextCollectTime) {
            const remainingTime = new Date(task.nextCollectTime).getTime() - Date.now();
            newTimers[task._id] = remainingTime > 0 ? remainingTime : 0;
          } else {
            newTimers[task._id] = 0;
          }
        });
        setTimers(newTimers);
      } else {
        setBoughtTasks([]);
      }

      setUser((prev) => ({ ...prev, wallet: res.data.wallet }));
    } catch (error) {
      console.error("❌ Error Fetching Tasks:", error);
      setBoughtTasks([]);
    }
  };

  // ✅ Timer घटाने वाला useEffect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) => {
        const updatedTimers = { ...prevTimers };

        Object.keys(updatedTimers).forEach((taskId) => {
          if (updatedTimers[taskId] > 0) {
            updatedTimers[taskId] -= 1000;
          } else {
            updatedTimers[taskId] = 0;
          }
        });

        return updatedTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Helper function for time format
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}h:${String(minutes).padStart(2, "0")}m:${String(seconds).padStart(2, "0")}s`;
  };

  // ✅ **Profit Collect करने का Logic**
  const collectProfit = async (taskId) => {
    try {
      // ✅ LocalStorage Se Token Lo
      const token = localStorage.getItem("token");
      // console.log("🟢 Sending Token in Header:", token);

      const { data } = await axios.post(
        "/api/collect-profit",
        { taskId },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }, // ✅ Token Header me send karo
        }
      );

      toast.success(data.message);
      setUser((prev) => ({ ...prev, wallet: data.wallet }));
      fetchUserTasks();
    } catch (error) {
      console.error("❌ Collect Profit Error:", error.response);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="task-container-main">
      <div className="navbar-cont">
        <div className="task-container-title">
          <h2 className="title1">🛍️ Your Purchased Tasks </h2>
          {/* <div className="dashboard-price">
            <CiWallet className="wallet-icon2" color="orange" />
            <p className="wallet-price">$ {user?.wallet}</p>

          </div> */}
          <div className="dashboard-price tasklist-wallet">
            <p className="dashboard-wallet" >$ {user?.wallet}.00</p>
            <FaWallet className="wallet-icon" />
          </div>
        </div>
        <div className="task-container1">

          <div className="f" >
            <div className="task-grid1">
              {boughtTasks && boughtTasks.length > 0 ? (
                boughtTasks.map((task) => {
                  const remainingTime = timers[task._id] || 0;
                  const canCollect = remainingTime <= 0;
                  const buyTaskImage = priceToImageMap[task.price] || Task1; // fallback image

                  return (
                    <div className="task-card1" key={task._id}>
                      <img src={buyTaskImage} alt="Product1" />
                      <div className="plan-details1">
                        <div className="detail1">
                          <p>Daily Profit</p>
                          <h3><span className="profit-color">{task.dailyProfit}.00</span> USDT</h3>
                        </div>
                        <div className="detail1">
                          <p>Price</p>
                          <h3>{task.price}.00 USDT</h3>
                        </div>
                        <div className="detail1">
                          <p>Duration</p>
                          <h3>{task.duration} days</h3>
                        </div>
                        <div className="detail1">
                          <p>Total Profit</p>
                          <h3>{task.totalProfit}.00 USDT</h3>
                        </div>
                      </div>

                      <button
                        className="buy-btn1"
                        onClick={() => collectProfit(task._id)}
                        disabled={!canCollect}
                      >
                        {canCollect
                          ? "💰 Collect Profit"
                          : `⏳🔓 ${formatTime(remainingTime)}`}
                      </button>
                    </div>
                  );
                })
              ) : (
                <p>😢 No tasks bought yet</p>
              )}
            </div>

          </div>

        </div>

      </div>
      <div className="tasklistnav">
        <BottomNavbar />
      </div>
    </div>
  );
};

export default TaskList;