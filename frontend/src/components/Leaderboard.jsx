import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/leaderboard.css";
import BottomNavbar from "../components/BottomNavbar"
import { BASE_URL } from "../config";
import userPng from "../assets/images/user.png";

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/user/leaderboard`);
                setLeaderboard(response.data);
            } catch (error) {
                console.error("❌ Error fetching leaderboard:", error);
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <div className="leaderboard-container-main">
            {/* <h3 className="leaderboard-title">🏆 Leaderboard</h3> */}
            <div className="task-hall1">
                <span>🏆 Leaderboard</span>
                <div className="corner1 left1"></div>
                <div className="corner1 right1"></div>
            </div>
            <div className="leaderboard-container">
                <h1 className="leaderboard-heading">🏆 Top Earner of the Week</h1>
                <ul className="leaderboard-list">
                    {leaderboard.map((user, index) => (
                        <li key={index} className={`leaderboard-item rank-${index + 1}`}>
                            <span className="rank-badge">{index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}</span>
                            {/* <img src={user.avatar} alt={user.username} className="avatar" /> */}
                            <img src={userPng} alt={user.username} className="avatar" />
                            <span className="leaderboard-username">{user.username}</span>
                            <span className="leaderboard-earning">💰 ${user.totalEarning}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="tasklistnav">
                <BottomNavbar />
            </div>

        </div>
    );
};

export default Leaderboard;
