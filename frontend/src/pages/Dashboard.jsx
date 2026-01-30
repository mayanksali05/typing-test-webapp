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

    if (loading || !user) return <div className="center" style={{ height: '80vh' }}><i className="fas fa-spinner fa-spin fa-2x"></i></div>;

    // XP Progress Calculation
    const xpForCurrentLevel = Math.pow(user.level - 1, 2) * 100;
    const xpForNextLevel = Math.pow(user.level, 2) * 100;
    const currentProgress = user.xp - xpForCurrentLevel;
    const targetProgress = xpForNextLevel - xpForCurrentLevel;
    const progressPercent = Math.min(Math.max((currentProgress / targetProgress) * 100, 0), 100);

    return (
        <div className="page-container" style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.2rem' }}>{user.name}</h1>
                    <p style={{ color: 'var(--sub-color)' }}>Level {user.level} Typer</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--sub-color)', marginBottom: '0.5rem' }}>{user.xp} XP</div>
                    <div style={{ width: '200px', height: '8px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--main-color)', transition: 'width 0.5s ease-out' }}></div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                {[
                    { label: 'Tests Taken', value: stats?.testsTaken || 0, icon: 'keyboard' },
                    { label: 'Best WPM', value: stats?.bestWpm || 0, icon: 'bolt', color: 'var(--main-color)' },
                    { label: 'Avg WPM', value: stats?.avgWpm || 0, icon: 'chart-line' },
                    { label: 'Avg Accuracy', value: `${stats?.avgAccuracy || 0}%`, icon: 'crosshairs' }
                ].map((item, i) => (
                    <div key={i} className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem' }}>
                        <i className={`fas fa-${item.icon}`} style={{ color: item.color || 'var(--sub-color)', marginBottom: '0.8rem', fontSize: '1.2rem', opacity: 0.6 }}></i>
                        <div style={{ color: 'var(--sub-color)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.label}</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '0.5rem', color: item.color || 'var(--text-color)' }}>{item.value}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                {/* History Section */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fas fa-history" style={{ opacity: 0.5 }}></i> Recent Activity
                    </h3>
                    {history.length === 0 ? (
                        <p style={{ color: 'var(--sub-color)', textAlign: 'center', padding: '2rem' }}>No tests yet. Go type!</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', color: 'var(--sub-color)', fontSize: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <th style={{ padding: '10px' }}>WPM</th>
                                        <th style={{ padding: '10px' }}>ACC</th>
                                        <th style={{ padding: '10px' }}>MODE</th>
                                        <th style={{ padding: '10px' }}>DATE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history.slice(0, 10).map((test) => (
                                        <tr key={test._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', transition: 'background 0.2s' }} className="history-row">
                                            <td style={{ padding: '12px 10px', fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--main-color)' }}>{test.wpm}</td>
                                            <td style={{ padding: '12px 10px' }}>{test.accuracy}%</td>
                                            <td style={{ padding: '12px 10px', color: 'var(--sub-color)', fontSize: '0.9rem' }}>{test.duration}s</td>
                                            <td style={{ padding: '12px 10px', color: 'var(--sub-color)', fontSize: '0.8rem' }}>{new Date(test.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Achievements Section */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fas fa-trophy" style={{ color: '#fbbf24' }}></i> Achievements
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '1rem' }}>
                        {user.achievements && user.achievements.length > 0 ? (
                            user.achievements.map((ach, i) => (
                                <div key={i} title={`${ach.name}: ${ach.description}`} style={{
                                    aspectRatio: '1',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '5px',
                                    border: '1px solid rgba(251, 191, 36, 0.2)',
                                    textAlign: 'center'
                                }}>
                                    <i className="fas fa-award" style={{ fontSize: '1.5rem', color: '#fbbf24', marginBottom: '5px' }}></i>
                                    <div style={{ fontSize: '0.6rem', fontWeight: 'bold', lineHeight: '1.2' }}>{ach.name}</div>
                                </div>
                            ))
                        ) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--sub-color)', fontSize: '0.9rem' }}>
                                No awards yet. Keep training!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
