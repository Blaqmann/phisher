// src/pages/AdminDashboard.js
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { addDoc, deleteDoc, collection, query, where, getDocs, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css'; // Import the new CSS file

const AdminDashboard = ({ onLogout }) => {
    const [url, setUrl] = useState('');
    const [indicator, setIndicator] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        onLogout();
        navigate('/login');
    };

    const updateUrl = async () => {
        try {
            const urlCollection = collection(db, 'knownUrls');
            const urlQuery = query(urlCollection, where("url", "==", url));
            const querySnapshot = await getDocs(urlQuery);

            if (!querySnapshot.empty) {
                toast.error('URL already exists.');
                return;
            }

            await addDoc(urlCollection, { url, isPhishing: true });
            toast.success('URL added successfully.');
        } catch (error) {
            toast.error('Failed to add URL.');
        }
    };

    const removeUrl = async () => {
        try {
            const urlCollection = collection(db, 'knownUrls');
            const urlQuery = query(urlCollection, where("url", "==", url));
            const querySnapshot = await getDocs(urlQuery);

            if (querySnapshot.empty) {
                toast.error('URL does not exist.');
                return;
            }

            await deleteDoc(doc(db, 'knownUrls', querySnapshot.docs[0].id));
            toast.success('URL removed successfully.');
        } catch (error) {
            toast.error('Failed to remove URL.');
        }
    };

    const updateIndicator = async () => {
        try {
            const indicatorCollection = collection(db, 'suspiciousKeywords');
            const indicatorQuery = query(indicatorCollection, where("keyword", "==", indicator));
            const querySnapshot = await getDocs(indicatorQuery);

            if (!querySnapshot.empty) {
                toast.error('Indicator already exists.');
                return;
            }

            await addDoc(indicatorCollection, { keyword: indicator, isPhishing: true });
            toast.success('Indicator added successfully.');
        } catch (error) {
            toast.error('Failed to add indicator.');
        }
    };

    const removeIndicator = async () => {
        try {
            const indicatorCollection = collection(db, 'suspiciousKeywords');
            const indicatorQuery = query(indicatorCollection, where("keyword", "==", indicator));
            const querySnapshot = await getDocs(indicatorQuery);

            if (querySnapshot.empty) {
                toast.error('Indicator does not exist.');
                return;
            }

            await deleteDoc(doc(db, 'suspiciousKeywords', querySnapshot.docs[0].id));
            toast.success('Indicator removed successfully.');
        } catch (error) {
            toast.error('Failed to remove indicator.');
        }
    };

    return (
        <div className="dashboard-container">
            <h1 className="admin-dashboard-title">Admin Dashboard</h1>
            <div className="admin-dashboard-section">
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter URL"
                    className="admin-dashboard-input"
                />
                <div className="admin-dashboard-buttons">
                    <button className="admin-dashboard-button" onClick={updateUrl}>Update URL</button>
                    <button className="admin-dashboard-button" onClick={removeUrl}>Remove URL</button>
                </div>
            </div>
            <div className="admin-dashboard-section">
                <input
                    type="text"
                    value={indicator}
                    onChange={(e) => setIndicator(e.target.value)}
                    placeholder="Enter Indicator"
                    className="admin-dashboard-input"
                />
                <div className="admin-dashboard-buttons">
                    <button className="admin-dashboard-button" onClick={updateIndicator}>Update Indicator</button>
                    <button className="admin-dashboard-button" onClick={removeIndicator}>Remove Indicator</button>
                </div>
            </div>
            <button className="admin-dashboard-logout" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default AdminDashboard;
