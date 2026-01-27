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
        <div style={{ width: '100%' }}>

            {testState === 'start' && (
                <>
                    {/* Time Selector */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '50px', background: '#2c2e31', width: 'fit-content', margin: '0 auto 50px auto', padding: '10px 20px', borderRadius: '30px' }}>
                        {[15, 30, 60].map(t => (
                            <button
                                key={t}
                                onClick={() => setTimeLimit(t)}
                                style={{
                                    color: timeLimit === t ? 'var(--main-color)' : 'var(--sub-color)',
                                    fontWeight: timeLimit === t ? 'bold' : 'normal'
                                }}
                            >
                                {t}s
                            </button>
                        ))}
                    </div>

                    <TypingArea timeLimit={timeLimit} onTestEnd={handleTestEnd} />
                </>
            )}

            {testState === 'finished' && lastResult && (
                <div className="center" style={{ flexDirection: 'column', animation: 'fadeIn 0.5s' }}>
                    <h2 style={{ color: 'var(--sub-color)', marginBottom: '10px' }}>Test Completed</h2>
                    <div style={{ fontSize: '4rem', fontWeight: 'bold', color: 'var(--main-color)' }}>
                        {lastResult.wpm}
                        <span style={{ fontSize: '1rem', color: 'var(--sub-color)', display: 'block', textAlign: 'center' }}>WPM</span>
                    </div>

                    <div style={{ display: 'flex', gap: '40px', marginTop: '30px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem' }}>{lastResult.accuracy}%</div>
                            <div style={{ color: 'var(--sub-color)' }}>acc</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem' }}>{lastResult.correctChars}</div>
                            <div style={{ color: 'var(--sub-color)' }}>chars</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', color: 'var(--error-color)' }}>{lastResult.incorrectChars}</div>
                            <div style={{ color: 'var(--sub-color)' }}>errors</div>
                        </div>
                    </div>

                    <div style={{ marginTop: '40px', display: 'flex', gap: '20px' }}>
                        <button onClick={() => setTestState('start')} style={{ padding: '10px 20px', background: 'var(--main-color)', color: 'var(--bg-color)', borderRadius: '5px', fontWeight: 'bold' }}>
                            Next Test
                        </button>
                        {!user && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ color: 'var(--sub-color)' }}>Sign in to save results</span>
                                <Link to="/login" style={{ color: 'var(--main-color)' }}>Login</Link>
                            </div>
                        )}
                        {user && saving && <span style={{ color: 'var(--sub-color)' }}>Saving...</span>}
                    </div>
                </div>
            )}

        </div>
    );
};

export default Home;
