// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Correct import from 'react-dom/client'
import './index.css';
import App from './App';
import { initializeMsalInstance } from './config/msalConfig';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

initializeMsalInstance().then(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}).catch(error => {
  console.error("Failed to initialize MSAL", error);
  root.render(
    <div>Failed to initialize the application. Please check the console for more details.</div>
  );
});

reportWebVitals();
