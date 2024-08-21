// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Signup from './pages/SignUp';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import EmailScan from './pages/EmailScan';
import ViewScannedEmails from './pages/ViewScannedEmails';
import UrlScan from './pages/UrlScan';
import Reports from './pages/Reports';
import About from './pages/About';
import ResetPassword from './pages/ResetPassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get the user role from Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userData = userDoc.data();

          if (userData && userData.role !== undefined) {
            setRole(userData.role);
            setIsAuthenticated(true);
          } else {
            throw new Error("User role not found.");
          }
        } catch (error) {
          console.error("Failed to fetch user role:", error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login onLogin={(user) => { setIsAuthenticated(true); setRole(user.role); }} />} />
        <Route path="/dashboard" element={isAuthenticated ? (role === 1 ? <AdminDashboard onLogout={handleLogout} /> : <Dashboard onLogout={handleLogout} />) : <Login onLogin={handleLogin} />} />
        <Route path="/email-scan" element={<EmailScan />} />
        <Route path="/view-scanned-emails" element={<ViewScannedEmails />} />
        <Route path="/url-scan" element={<UrlScan />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/about" element={<About />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
