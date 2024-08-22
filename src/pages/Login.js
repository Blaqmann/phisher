// src/pages/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import '../App.css';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await login(email, password);
            localStorage.setItem('token', response.accessToken); // Store token
            if (response.role !== undefined) {
                onLogin(response);
            } else {
                throw new Error("User role not found.");
            }
            navigate('/dashboard');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="dashboard-container">
            <form onSubmit={handleSubmit}>
                {error && <p className="error">{error}</p>}
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" disabled={loading}>Log In</button>
                <p>Don't have an account? <Link to="/signup" className="link">Sign Up</Link></p>
                <p><Link to="/reset-password" className="link">Forgot Password?</Link></p>
            </form>
        </div>
    );
};

export default Login;
