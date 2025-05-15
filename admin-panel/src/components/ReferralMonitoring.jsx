

import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";
import html2canvas from "html2canvas";
import "../styles/referralMonitoring.css";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f", "#ff6f91"];

const ReferralMonitoring = () => {
    const [topReferrers, setTopReferrers] = useState([]);
    const [incomeData, setIncomeData] = useState([]);
    const [chartType, setChartType] = useState("doughnut");
    const [incomeChart, setIncomeChart] = useState("bar");
    const [rewardPercent, setRewardPercent] = useState(5);


    useEffect(() => {
        const token = localStorage.getItem("adminToken");

        fetch("https://task-8ibm.onrender.com/api/admin/top-referrers", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setTopReferrers(data));

        fetch("https://task-8ibm.onrender.com/api/admin/referral-chart", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setIncomeData(data));

        fetch("https://task-8ibm.onrender.com/api/admin/referral-settings", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setRewardPercent(data.referralRewardPercent || 5));
    }, []);

    const updateRewardPercent = () => {
        const token = localStorage.getItem("adminToken");
        fetch("https://task-8ibm.onrender.com/api/admin/referral-settings", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ referralRewardPercent: rewardPercent })
        })
            .then(res => res.json())
            .then(() => toast.success("Referral reward % updated ✅"))
            .catch(err => {
                console.error(err);
                toast.error("Update failed ❌");
            });
    };

    const exportChart = () => {
        const element = document.querySelector(".referral-container");
        html2canvas(element).then((canvas) => {
            const link = document.createElement("a");
            link.download = "referral-stats.png";
            link.href = canvas.toDataURL();
            link.click();
        });
    };

    return (
        <div className="referral-container">
            <h2 className="referral-title">🔗 Referral Monitoring</h2>

            {/* Toggle & Export */}
            <div className="toggle-btns">
                <button className={chartType === "doughnut" ? "active" : ""} onClick={() => setChartType("doughnut")}>Doughnut</button>
                <button className={chartType === "pie" ? "active" : ""} onClick={() => setChartType("pie")}>Pie</button>

                <button className={incomeChart === "bar" ? "active" : ""} onClick={() => setIncomeChart("bar")}>Bar Chart</button>
                <button className={incomeChart === "line" ? "active" : ""} onClick={() => setIncomeChart("line")}>Line Chart</button>

                <button className="export-btn" onClick={exportChart}>📸 Export Chart</button>
            </div>

            {/* Referrer Chart */}
            <div className="referral-section chart-box">
                <h3>🎯 Top Referrers ({chartType === "doughnut" ? "Doughnut" : "Pie"} Chart)</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={topReferrers.map(u => ({
                                name: u.username,
                                value: u.referralWallet
                            }))}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={chartType === "doughnut" ? 50 : 0}
                            outerRadius={80}
                            label
                            isAnimationActive={true}
                        >
                            {topReferrers.map((_, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Income Chart */}
            <div className="referral-section chart-box">
                <h3>📊 Referral Income Chart ({incomeChart === "bar" ? "Bar" : "Line"})</h3>
                <ResponsiveContainer width="100%" height={250}>
                    {incomeChart === "bar" ? (
                        <BarChart data={incomeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8884d8" barSize={40} radius={[6, 6, 0, 0]} />
                        </BarChart>
                    ) : (
                        <LineChart data={incomeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} />
                        </LineChart>
                    )}
                </ResponsiveContainer>
            </div>

            {/* Referral Settings Inputs */}
            <div className="referral-section reward-input">
                <h3>💰 Referral Settings</h3>

                <div className="input-group">
                    <label>Referral Reward Percent (%)</label>
                    <input
                        type="number"
                        value={rewardPercent}
                        onChange={(e) => setRewardPercent(parseInt(e.target.value))}
                        min="1"
                        max="100"
                    />
                </div>

                <button className="save-btn" onClick={updateRewardPercent}>
                    Save Settings
                </button>
            </div>

        </div>
    );
};

export default ReferralMonitoring;
