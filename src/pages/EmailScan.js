// src/pages/EmailScan.js
import React, { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { fetchEmailsApi } from '../services/gmailApi';
import { signInAndFetchEmails } from '../services/outlookApi'; // Import the Outlook function
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaGoogle, FaMicrosoft } from 'react-icons/fa'; // Import Google and Microsoft icons
import 'react-toastify/dist/ReactToastify.css';
import '../styles/EmailScan.css';

const auth = getAuth();
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/gmail.readonly');

const EmailScan = () => {
    const [error, setError] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const handleGoogleSignIn = async () => {
        setIsButtonDisabled(true);
        try {
            const result = await signInWithPopup(auth, provider);
            const oauthToken = result._tokenResponse.oauthAccessToken;
            localStorage.setItem('googleToken', oauthToken);

            await fetchEmailsApi(); // Fetch Gmail emails

            toast.success("Successfully signed in with Google and emails fetched!", {
                onClose: () => setIsButtonDisabled(false)
            });

        } catch (error) {
            console.error("Error signing in with Google:", error);
            setError('Failed to authenticate with Google.');
            toast.error("Failed to sign in with Google.", {
                onClose: () => setIsButtonDisabled(false)
            });
        }
    };

    const handleOutlookSignIn = async () => {
        setIsButtonDisabled(true);
        try {
            await signInAndFetchEmails(); // Fetch Outlook emails
            toast.success("Successfully signed in with Outlook and emails fetched!", {
                onClose: () => setIsButtonDisabled(false)
            });
        } catch (error) {
            console.error("Error signing in with Outlook:", error);
            setError('Failed to authenticate with Outlook.');
            toast.error("Failed to sign in with Outlook.", {
                onClose: () => setIsButtonDisabled(false)
            });
        }
    };

    return (
        <div className="dashboard-container">
            <h1>Email Scanner</h1>
            <p>Connect to your email account to scan your inbox for phishing emails.</p>
            {error && <p className="error">{error}</p>}
            <div className="login-buttons-container">
                <button
                    onClick={handleGoogleSignIn}
                    className="google-signin-button"
                    disabled={isButtonDisabled}
                >
                    <FaGoogle style={{ marginRight: '8px' }} />
                    {isButtonDisabled ? 'Signing in...' : 'Sign in with Google'}
                </button>
                <button
                    onClick={handleOutlookSignIn}
                    className="outlook-signin-button"
                    disabled={isButtonDisabled}
                >
                    <FaMicrosoft style={{ marginRight: '8px' }} />
                    {isButtonDisabled ? 'Signing in...' : 'Sign in with Outlook'}
                </button>
            </div>
            <hr />
            <div className="view-scanned-emails">
                <Link to="/view-scanned-emails">View all scanned emails</Link>
            </div>
        </div>
    );
};

export default EmailScan;
