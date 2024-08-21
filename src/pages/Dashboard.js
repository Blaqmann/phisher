// src/pages/Dashboard.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const Dashboard = ({ onLogout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        onLogout();
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard</h1>
            <div className="dashboard-buttons">
                <Link to="/email-scan"><button className="dashboard-button">Email Scan</button></Link>
                <Link to="/url-scan"><button className="dashboard-button">URL Scan</button></Link>
                <Link to="/reports"><button className="dashboard-button">Reports and Analytics</button></Link>
                <button className="dashboard-button logout" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default Dashboard;
