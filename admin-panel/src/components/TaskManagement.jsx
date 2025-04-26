

import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/taskManagement.css";

const TaskManagement = () => {
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        price: 0,
        dailyProfit: 0,
        duration: 0,
        totalProfit: 0,
        isActive: true
    });

    // Token ko localStorage se fetch karo
    const token = localStorage.getItem("adminToken");

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = () => {
        fetch("https://task-b1w0.onrender.com/api/admin/tasks", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Authorization header mein token bhejein
            }
        })
            .then(res => res.json())
            .then(data => setTasks(data));
    };

    const openModal = (task = null) => {
        if (task) {
            setFormData(task);
            setIsEditing(true);
        } else {
            setFormData({ name: "", price: 0, dailyProfit: 0, duration: 0, totalProfit: 0, isActive: true });
            setIsEditing(false);
        }
        setShowModal(true);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = isEditing ? `https://task-b1w0.onrender.com/api/admin/tasks/${formData._id}` : "https://task-b1w0.onrender.com/api/admin/tasks";
        const method = isEditing ? "PUT" : "POST";

        fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Authorization header mein token bhejein
            },
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(() => {
                fetchTasks();
                setShowModal(false);
                toast.success(isEditing ? "✅ Task updated successfully!" : "🎉 Task created successfully!");
            });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure to delete this task?")) {
            toast.success("Task Delete successfully ✅");
            fetch(`https://task-b1w0.onrender.com/api/admin/tasks/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}` // Authorization header mein token bhejein
                }
            })
                .then(() => fetchTasks());
        }
    };

    const toggleActive = (id, current) => {
        fetch(`https://task-b1w0.onrender.com/api/admin/tasks/${id}/toggle`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Authorization header mein token bhejein
            },
            body: JSON.stringify({ isActive: !current })
        })
            .then(() => fetchTasks());
    };

    return (
        <div className="task-container">
            <h2>📝 Task Management</h2>
            <button className="add-btn" onClick={() => openModal()}>➕ Add Task</button>

            <table className="task-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Daily Profit</th>
                        <th>Total Profit</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr key={task._id}>
                            <td>{task.name}</td>
                            <td>${task.price}</td>
                            <td>${task.dailyProfit}</td>
                            <td>${task.totalProfit}</td>
                            <td>{task.duration} days</td>
                            <td>{task.isActive ? "✅ Active" : "❌ Inactive"}</td>
                            <td>
                                <button className="edit-btn" onClick={() => openModal(task)}>✏️ Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete(task._id)}>🗑 Delete</button>
                                <button className="toggle-btn" onClick={() => toggleActive(task._id, task.isActive)}>
                                    {task.isActive ? "🔴 Disable" : "🟢 Enable"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>{isEditing ? "Edit Task" : "Add Task"}</h3>
                        <form onSubmit={handleSubmit}>
                            <input className="task-name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Task Name" required />
                            <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" required />
                            <input type="number" name="dailyProfit" value={formData.dailyProfit} onChange={handleChange} placeholder="Daily Profit" required />
                            <input type="number" name="totalProfit" value={formData.totalProfit} onChange={handleChange} placeholder="Total Profit" required />
                            <input type="number" name="duration" value={formData.duration} onChange={handleChange} placeholder="Duration (days)" required />
                            <label>
                                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
                                Active
                            </label>
                            <div className="modal-actions">
                                <button type="submit">💾 {isEditing ? "Update" : "Create"}</button>
                                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskManagement;
