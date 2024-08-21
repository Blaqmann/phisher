// src/services/gmailApi.js
import { db } from '../firebaseConfig';
import { doc, getDoc, collection, addDoc } from "firebase/firestore";


// Fetch emails using the Gmail API and save only essential data
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

            const fromHeader = msgData.payload.headers.find(header => header.name === "From");
            const subjectHeader = msgData.payload.headers.find(header => header.name === "Subject");

            const emailDocRef = doc(db, "emails", msg.id);
            const emailDocSnap = await getDoc(emailDocRef);

            if (!emailDocSnap.exists()) {
                await addDoc(collection(db, "emails"), {
                    id: msg.id,
                    from: fromHeader ? fromHeader.value : "Unknown sender",
                    subject: subjectHeader ? subjectHeader.value : "No subject",
                    snippet: msgData.snippet || "No snippet available",
                    createdAt: new Date(),
                });

                return { id: msg.id, from: fromHeader.value, subject: subjectHeader.value, snippet: msgData.snippet };
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
