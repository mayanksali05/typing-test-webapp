import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }

        if (user) {
            fetchHistory();
        }
    }, [user, loading, navigate]);

    const fetchHistory = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/test/history');
            setHistory(res.data.history);
            setStats(res.data.stats);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading || !user) return <div>Loading...</div>;

    return (
        <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '20px' }}>Dashboard</h2>

            {stats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
                    <div style={{ background: '#2c2e31', padding: '15px', borderRadius: '5px', textAlign: 'center' }}>
                        <div style={{ color: 'var(--sub-color)', fontSize: '0.8rem' }}>Tests Taken</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.testsTaken}</div>
                    </div>
                    <div style={{ background: '#2c2e31', padding: '15px', borderRadius: '5px', textAlign: 'center' }}>
                        <div style={{ color: 'var(--sub-color)', fontSize: '0.8rem' }}>Best WPM</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--main-color)' }}>{stats.bestWpm}</div>
                    </div>
                    <div style={{ background: '#2c2e31', padding: '15px', borderRadius: '5px', textAlign: 'center' }}>
                        <div style={{ color: 'var(--sub-color)', fontSize: '0.8rem' }}>Avg WPM</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.avgWpm}</div>
                    </div>
                    <div style={{ background: '#2c2e31', padding: '15px', borderRadius: '5px', textAlign: 'center' }}>
                        <div style={{ color: 'var(--sub-color)', fontSize: '0.8rem' }}>Avg Acc</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.avgAccuracy}%</div>
                    </div>
                </div>
            )}

            <h3 style={{ marginBottom: '15px' }}>History</h3>
            {history.length === 0 ? (
                <p style={{ color: 'var(--sub-color)' }}>No tests taken yet.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', color: 'var(--sub-color)' }}>
                            <th style={{ padding: '10px' }}>wpm</th>
                            <th style={{ padding: '10px' }}>accuracy</th>
                            <th style={{ padding: '10px' }}>mode</th>
                            <th style={{ padding: '10px' }}>date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((test) => (
                            <tr key={test._id} style={{ borderBottom: '1px solid #2c2e31' }}>
                                <td style={{ padding: '10px', fontSize: '1.2rem', color: 'var(--main-color)' }}>{test.wpm}</td>
                                <td style={{ padding: '10px' }}>{test.accuracy}%</td>
                                <td style={{ padding: '10px', color: 'var(--sub-color)' }}>{test.duration}s</td>
                                <td style={{ padding: '10px', color: 'var(--sub-color)' }}>{new Date(test.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Dashboard;
