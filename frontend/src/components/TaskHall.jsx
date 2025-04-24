import React from "react";
import "../styles/taskHall.css";

const TaskHall = () => {
    return (
        <div className="task-hall-container">
            <div className="task-hall">
                <span>🛍️ Available Tasks</span>
                <div className="corner left"></div>
                <div className="corner right"></div>
            </div>

        </div>
    );
};

export default TaskHall;