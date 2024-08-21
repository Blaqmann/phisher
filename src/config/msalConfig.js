// src/config/msalConfig.js
import { PublicClientApplication } from '@azure/msal-browser';

const msalConfig = {
    auth: {
        clientId: process.env.REACT_APP_CLIENT_ID,
        authority: `https://login.microsoftonline.com/common`,
        redirectUri: process.env.REACT_APP_REDIRECT_URI
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false
    },
    system: {
        allowNativeBroker: true
    }
};

const msalInstance = new PublicClientApplication(msalConfig);

// Initialization function to be called before any MSAL API usage
async function initializeMsalInstance() {
    try {
        const response = await msalInstance.initialize();
        if (response) {
            console.log("MSAL Initialized Successfully:", response);
        }
        await msalInstance.handleRedirectPromise();
    } catch (error) {
        console.error("Error initializing MSAL:", error);
        throw error;
    }
}

export { msalInstance, initializeMsalInstance };
