import React from "react";
import "../styles/taskProgress.css";

const TaskProgress = ({ task }) => {
  
  const progressPercent = (task.progress / task.totalDuration) * 100;

  return (
    <div className="task-progress">
      <h3>{task.name}</h3>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progressPercent}%` }}></div>
      </div>
      <p>{task.progress}/{task.totalDuration} Days Completed</p>
    </div>
  );
};

export default TaskProgress;
