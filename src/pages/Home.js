// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Home = () => {
    return (
        <div className="dashboard-container">
            <h1>Welcome to Fijabi Phisher Anti-Phishing Software</h1>
            <p>This app helps you protect against phishing attacks.</p>
            <Link to="/signup"><button>Get Started</button></Link>
        </div>
    );
};

export default Home;
