// src/pages/UrlScan.js
import React, { useState } from 'react';
import { analyzeUrl } from '../services/fireStoreApi';
import { ThreeDots } from 'react-loader-spinner';
import '../styles/UrlScan.css';

const UrlScan = () => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);

    const handleAnalyze = async () => {
        setLoading(true);
        setReport(null);
        setError('');
        try {
            const response = await analyzeUrl(url);
            setReport(response);
        } catch (error) {
            setError('URL analysis failed, please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="url-scan-container">
            <h1>Enter URL to Analyze</h1>
            {error && <p className="error">{error}</p>}
            <input
                type="text"
                placeholder="Enter URL"
                onChange={(e) => setUrl(e.target.value)}
                required
                className="url-input"
            />
            <button onClick={handleAnalyze} disabled={loading} className="analyze-button">
                Analyze
            </button>
            {loading && (
                <div className="loader">
                    <ThreeDots
                        height="80"
                        width="80"
                        radius="9"
                        color="#00BFFF"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        wrapperClassName=""
                        visible={true}
                    />
                </div>
            )}
            {report && (
                <div className={`report-container ${report.isPhishing ? 'phishing' : 'safe'}`}>
                    <h2>Analysis Report</h2>
                    <p>{report.isPhishing ? 'Warning: This URL is identified as a phishing link.' : 'This URL is safe. However, always remain cautious.'}</p>
                </div>
            )}
        </div>
    );
};

export default UrlScan;
