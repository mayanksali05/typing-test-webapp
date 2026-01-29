import React, { useState } from 'react';
import TypingArea from '../components/TypingArea';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
    const [testState, setTestState] = useState('start'); // start, finished
    const [timeLimit, setTimeLimit] = useState(30);
    const [lastResult, setLastResult] = useState(null);
    const { user } = useAuth();
    const [saving, setSaving] = useState(false);

    const handleTestEnd = async (stats) => {
        setLastResult({ ...stats, duration: timeLimit });
        setTestState('finished');

        if (user) {
            setSaving(true);
            try {
                await axios.post('http://localhost:5000/api/test/save', {
                    wpm: stats.wpm,
                    accuracy: stats.accuracy,
                    errors: stats.incorrectChars,
                    totalCharacters: stats.totalChars,
                    duration: timeLimit
                });
            } catch (err) {
                console.error("Failed to save result", err);
            }
            setSaving(false);
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>

            {testState === 'start' && (
                <div className="page-container center" style={{ flexDirection: 'column' }}>
                    {/* Time Selector */}
                    <div className="glass-panel" style={{
                        display: 'flex',
                        gap: '0.5rem',
                        marginBottom: '3rem',
                        padding: '0.5rem',
                        borderRadius: 'calc(var(--radius) * 2)',
                        background: 'rgba(15, 23, 42, 0.4)'
                    }}>
                        {[15, 30, 60].map(t => (
                            <button
                                key={t}
                                onClick={() => setTimeLimit(t)}
                                className={timeLimit === t ? 'btn-primary' : ''}
                                style={{
                                    color: timeLimit === t ? 'var(--bg-color)' : 'var(--sub-color)',
                                    fontWeight: timeLimit === t ? '700' : '500',
                                    borderRadius: 'var(--radius)',
                                    padding: '0.5rem 1.5rem',
                                    minWidth: '60px',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            >
                                {t}s
                            </button>
                        ))}
                    </div>

                    <TypingArea timeLimit={timeLimit} onTestEnd={handleTestEnd} />
                </div>
            )}

            {testState === 'finished' && lastResult && (
                <div className="center" style={{ flexDirection: 'column', animation: 'fadeIn 0.4s ease-out' }}>
                    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', width: '100%', maxWidth: '600px', position: 'relative', overflow: 'hidden' }}>
                        {/* Background subtle glow effect */}
                        <div style={{
                            position: 'absolute',
                            top: '-50%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '200px',
                            height: '200px',
                            background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)',
                            pointerEvents: 'none'
                        }}></div>

                        <h2 style={{ color: 'var(--sub-color)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>Test Completed</h2>

                        <div style={{ margin: '2rem 0' }}>
                            <div className="text-gradient" style={{ fontSize: '6rem', fontWeight: '800', lineHeight: '1' }}>
                                {lastResult.wpm}
                            </div>
                            <div style={{ fontSize: '1.2rem', color: 'var(--main-color)', fontWeight: '600', opacity: 0.8 }}>WPM</div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-color)' }}>{lastResult.accuracy}%</div>
                                <div style={{ color: 'var(--sub-color)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Accuracy</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success-color)' }}>{lastResult.correctChars}</div>
                                <div style={{ color: 'var(--sub-color)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Correct</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--error-color)' }}>{lastResult.incorrectChars}</div>
                                <div style={{ color: 'var(--sub-color)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Errors</div>
                            </div>
                        </div>

                        <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button onClick={() => setTestState('start')} className="btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <i className="fas fa-redo"></i> Next Test
                            </button>

                            {!user && (
                                <Link to="/login" className="btn-secondary" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <i className="fas fa-save"></i> Login to Save
                                </Link>
                            )}
                        </div>
                        {user && saving && <div style={{ marginTop: '1rem', color: 'var(--main-color)', fontSize: '0.9rem' }}><i className="fas fa-spinner fa-spin"></i> Saving result...</div>}
                    </div>
                </div>
            )}

        </div>
    );
};

export default Home;
