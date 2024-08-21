// src/pages/ViewScannedEmails.js
import React, { useEffect, useState } from 'react';
import { getDocs, collection } from "firebase/firestore";
import { db } from '../firebaseConfig';
import { scanEmail } from '../services/fireStoreApi';
import '../styles/ViewScannedEmails.css';

const ViewScannedEmails = () => {
    const [scannedEmails, setScannedEmails] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAndScanEmails = async () => {
            setLoading(true);
            try {
                const emailsCollection = collection(db, "emails");
                const emailSnapshot = await getDocs(emailsCollection);
                const emailsList = await Promise.all(emailSnapshot.docs.map(async doc => {
                    const data = doc.data();

                    // Perform scan and update the status
                    const status = await scanEmail(doc.id);

                    return {
                        id: doc.id,
                        subject: data.subject,
                        from: data.from,
                        snippet: data.snippet,
                        status: status || "Pending",
                    };
                }));
                setScannedEmails(emailsList);
            } catch (error) {
                console.error("Error fetching and scanning emails:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAndScanEmails();
    }, []);

    return (
        <div className="inbox-container">
            <h1 className="inbox-header">Scanned Emails</h1>
            {loading ? (
                <p>Loading scanned emails...</p>
            ) : scannedEmails.length > 0 ? (
                <div className="inbox-list">
                    <div className="inbox-headers">
                        <div className="inbox-header-from">Sender</div>
                        <div className="inbox-header-subject">Subject</div>
                        <div className="inbox-header-snippet">Message</div>
                        <div className="inbox-header-status">Status</div>
                    </div>
                    {scannedEmails.map((email) => (
                        <div key={email.id} className="inbox-item">
                            <div className="inbox-item-content">
                                <div className="inbox-item-from">{email.from}</div>
                                <div className="inbox-item-subject">{email.subject}</div>
                                <div className="inbox-item-snippet">{email.snippet}</div>
                                <div className="inbox-item-status">{email.status}</div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="inbox-empty">No scanned emails found.</p>
            )}
        </div>
    );
};

export default ViewScannedEmails;
