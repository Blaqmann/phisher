// src/pages/Reports.js
import React, { useState, useEffect, useRef } from 'react';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Automatically register all necessary charts
import '../styles/Reports.css';
import { getAuth } from 'firebase/auth';

const Reports = () => {
    const [chartData, setChartData] = useState(null);
    const [chartType, setChartType] = useState('Pie');
    const chartRef = useRef(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;

                if (user) {
                    const emailsCollection = collection(db, 'emails');
                    const q = query(emailsCollection, where("userId", "==", user.uid));
                    const emailSnapshot = await getDocs(q);
                    const totalEmails = emailSnapshot.size;
                    const safeEmails = emailSnapshot.docs.filter(doc => doc.data().status === 'Safe').length;
                    const suspiciousEmails = emailSnapshot.docs.filter(doc => doc.data().status === 'Suspicious').length;

                    setChartData({
                        labels: ['Total Emails Scanned', 'Safe Emails', 'Suspicious Emails'],
                        datasets: [{
                            label: '# of Emails',
                            data: [totalEmails, safeEmails, suspiciousEmails],
                            backgroundColor: ['#36A2EB', '#90EE90', '#FF0000'],
                        }]
                    });
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);


    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = chartRef.current.toBase64Image();
        link.download = 'report.png';
        link.click();
    };

    return (
        <div className="dashboard-container">
            <h2>Email Scanning Reports</h2>
            <select
                className="chart-selector"
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
            >
                <option value="Pie">Pie Chart</option>
                <option value="Bar">Bar Chart</option>
            </select>
            {chartData ? (
                <div className="chart-container">
                    {chartType === 'Pie' ? (
                        <Pie ref={chartRef} data={chartData} />
                    ) : (
                        <Bar ref={chartRef} data={chartData} />
                    )}
                    <button className="btn-download" onClick={handleDownload}>Download Report</button>
                </div>
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );
};

export default Reports;
