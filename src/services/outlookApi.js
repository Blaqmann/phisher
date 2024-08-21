// src/services/outlookApi.js
import { msalInstance } from '../config/msalConfig';
import { db } from '../firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

export const signInAndFetchEmails = async () => {
    try {
        await msalInstance.initialize();
        await msalInstance.handleRedirectPromise();

        const loginResponse = await msalInstance.loginPopup({
            scopes: ["User.Read", "Mail.Read"],
            prompt: "consent" // Force consent prompt
        });


        const tokenResponse = await msalInstance.acquireTokenSilent({
            scopes: ["Mail.Read"],
            account: loginResponse.account,
        });


        const accessToken = tokenResponse.accessToken;

        const emailResponse = await fetch(`https://graph.microsoft.com/v1.0/me/messages`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!emailResponse.ok) {
            const errorDetail = await emailResponse.json();
            console.error("Failed to fetch emails:", errorDetail);
            throw new Error('Failed to fetch emails');
        }

        const data = await emailResponse.json();
        const emails = data.value || [];

        await Promise.all(emails.map(async (email) => {
            await addDoc(collection(db, "emails"), {
                id: email.id,
                from: email.from.emailAddress.address,
                subject: email.subject,
                snippet: email.bodyPreview,
                createdAt: new Date(),
            });
        }));

        return emails;

    } catch (error) {
        console.error("Error fetching Outlook emails:", error);
        throw new Error('Failed to fetch Outlook emails.');
    }
};