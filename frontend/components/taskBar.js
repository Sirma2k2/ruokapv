import React from 'react';
import './taskBar.css';

const TaskBar = () => {
    return (
        <div className="taskbar">
            <button className="taskbar-button">Home</button>
            <button className="taskbar-button">Tasks</button>
            <button className="taskbar-button">Settings</button>
        </div>
    );
};

export default TaskBar;