// src/services/fireStoreApi.js
import { toast } from 'react-toastify';
import { db } from '../firebaseConfig';
import { doc, setDoc, getDoc, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Helper function to decode base64
const decodeBase64 = (base64) => {
    try {
        return decodeURIComponent(escape(window.atob(base64)));
    } catch (e) {
        console.error("Failed to decode base64:", e);
        return "";
    }
};

// Function to extract content from all parts
const extractContentFromParts = (parts) => {
    let textContent = "";
    parts.forEach(part => {
        if (part.body && part.body.data) {
            textContent += decodeBase64(part.body.data);
        }
        if (part.parts) {
            textContent += extractContentFromParts(part.parts); // Recursively extract content from nested parts
        }
    });
    return textContent;
};

// Function to extract URLs from text
const extractUrls = (text) => {
    if (!text || typeof text !== 'string') {
        return [];
    }
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
};

// Analyze URL function
export const analyzeUrl = async (url) => {
    try {
        const urlsCollection = collection(db, "knownUrls");
        const q = query(urlsCollection, where("url", "==", url));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const urlData = querySnapshot.docs[0].data();
            return urlData;
        } else {
            const newUrlDoc = await addDoc(urlsCollection, {
                url,
                isPhishing: false, // Assuming unknown URLs are safe by default
                createdAt: new Date()
            });
            return { id: newUrlDoc.id, isPhishing: false };
        }
    } catch (error) {
        toast.error('An unexpected error occurred.');
        throw error;
    }
};

// Analyze email content for phishing indicators
const analyzeEmailContent = async (email) => {
    const indicators = [];
    let textContent = "";

    // Check if the email payload contains parts
    if (email.payload && email.payload.parts) {
        // Extract content from parts
        textContent = extractContentFromParts(email.payload.parts);
    } else if (email.snippet) {
        // Fall back to using the snippet if parts are not available
        textContent = email.snippet;
    } else {
        return "Unknown";
    }

    // Existing URL check
    const urls = extractUrls(textContent);
    for (let url of urls) {
        const urlAnalysis = await analyzeUrl(url);
        if (urlAnalysis.isPhishing) {
            indicators.push(`Phishing URL detected: ${url}`);
        }
    }

    // New keyword check - case insensitive and context-aware
    const keywordsSnapshot = await getDocs(collection(db, 'suspiciousKeywords'));
    const keywords = keywordsSnapshot.docs.map(doc => doc.data().keyword.toLowerCase());

    for (let keyword of keywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');  // Word boundary check and case insensitive
        if (regex.test(textContent)) {
            indicators.push(`Suspicious keyword detected: ${keyword}`);
        }
    }

    // Scoring system - simple for now, could be expanded
    if (indicators.length === 0) {
        return "Safe";
    } else {
        return "Suspicious";
    }
};

// Example email scanning logic
export const scanEmail = async (emailId) => {
    try {
        const emailDoc = doc(db, "emails", emailId);
        const email = await getDoc(emailDoc);

        if (email.exists()) {
            const status = await analyzeEmailContent(email.data());
            await setDoc(emailDoc, { ...email.data(), status }, { merge: true });
            return status;
        } else {
            toast.error('Email not found.');
        }
    } catch (error) {
        toast.error(error.message);
        throw error;
    }
};

// Fetch emails using the Gmail API
export const fetchEmailsApi = async () => {
    try {
        const token = localStorage.getItem('googleToken');
        if (!token) throw new Error('Google token not found');

        const response = await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages?q=is:unread`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch emails');

        const data = await response.json();
        const emails = data.messages || [];

        const emailList = await Promise.all(emails.map(async (msg) => {
            const msgResponse = await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!msgResponse.ok) throw new Error('Failed to fetch email details');

            const msgData = await msgResponse.json();

            const emailDocRef = doc(db, "emails", msg.id);
            const emailDocSnap = await getDoc(emailDocRef);

            if (!emailDocSnap.exists()) {
                await addDoc(collection(db, "emails"), {
                    id: msg.id,
                    subject: msgData.snippet,
                    ...msgData,
                    createdAt: new Date(),
                });

                return { id: msg.id, subject: msgData.snippet, ...msgData };
            } else {
                console.log(`Email with ID ${msg.id} already exists in Firestore.`);
                return null;
            }
        }));

        return emailList.filter(email => email !== null);
    } catch (error) {
        throw new Error('Failed to fetch emails');
    }
};

const saveEmailToFirestore = async (email) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error('No user logged in');

    try {
        await addDoc(collection(db, "emails"), {
            ...email,
            userId: user.uid, // Store the user ID
            createdAt: new Date(),
        });
    } catch (error) {
        console.error("Error saving email:", error);
        throw error;
    }
};
