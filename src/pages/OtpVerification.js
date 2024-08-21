// src/pages/OtpVerification.js
import React, { useState } from 'react';
import { verifyOtp } from '../services/api';
import { useNavigate, useLocation } from 'react-router-dom';

const OTPVerification = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {}; // Retrieve email from state

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await verifyOtp(email, otp);
            navigate('/dashboard'); // Redirect to dashboard upon successful OTP verification
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                {error && <p className="error">{error}</p>}
                <div className="form-group">
                    <label>OTP</label>
                    <input type="text" placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} required />
                </div>
                <button type="submit" disabled={loading}>Verify OTP</button>
            </form>
        </div>
    );
};

export default OTPVerification;
