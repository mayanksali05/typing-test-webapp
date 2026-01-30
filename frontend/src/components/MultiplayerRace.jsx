import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import socket from '../socket';

const MultiplayerRace = () => {
    const { state } = useLocation();
    const { roomId: urlRoomId } = useParams();
    const navigate = useNavigate();

    const words = state?.words || [];
    const roomId = state?.roomId || urlRoomId;
    const playerName = state?.playerName || 'Guest';

    const [currIndex, setCurrIndex] = useState(0);
    const [currInput, setCurrInput] = useState('');
    const [history, setHistory] = useState({});
    const [status, setStatus] = useState('running');
    const [roomData, setRoomData] = useState(null);
    const [correctChars, setCorrectChars] = useState(0);
    const [incorrectChars, setIncorrectChars] = useState(0);

    const inputRef = useRef(null);

    useEffect(() => {
        if (!words.length) {
            navigate('/multiplayer');
            return;
        }

        socket.emit('join_room', { roomId, playerName });

        socket.on('room_update', (data) => {
            setRoomData(data);
        });

        return () => {
            socket.emit('leave_room', { roomId });
            socket.off('room_update');
        };
    }, [roomId, playerName, words, navigate]);

    // Live Stat Calculation (Simplified for real-time emit)
    useEffect(() => {
        let c = 0;
        let i = 0;

        Object.keys(history).forEach(idx => {
            const typed = history[idx];
            const target = words[idx];
            for (let k = 0; k < typed.length; k++) {
                if (k < target.length && typed[k] === target[k]) c++;
                else i++;
            }
            if (typed.length > target.length) i += (typed.length - target.length);
        });

        const target = words[currIndex];
        if (target) {
            for (let k = 0; k < currInput.length; k++) {
                if (k < target.length && currInput[k] === target[k]) c++;
                else i++;
            }
            if (currInput.length > target.length) i += (currInput.length - target.length);
        }

        setCorrectChars(c);
        setIncorrectChars(i);

        // Calculate progress percentage
        const progress = Math.round((currIndex / words.length) * 100);
        const wpm = Math.round((c / 5) / (0.5)); // Dummy WPM for real-time

        socket.emit('update_progress', { roomId, progress, wpm });
    }, [history, currInput, currIndex, words, roomId]);

    const finishRace = useCallback(() => {
        setStatus('finished');
        socket.emit('finish_race', { roomId, wpm: Math.round((correctChars / 5) / (0.5)) });
    }, [roomId, correctChars]);

    useEffect(() => {
        if (currIndex >= words.length && status === 'running') {
            finishRace();
        }
    }, [currIndex, words.length, status, finishRace]);

    const handleChange = (e) => {
        if (status === 'finished') return;
        const value = e.target.value;

        if (value.endsWith(' ')) {
            const trimmed = value.trim();
            setHistory(prev => ({ ...prev, [currIndex]: trimmed }));
            setCurrIndex(prev => prev + 1);
            setCurrInput('');
            return;
        }
        setCurrInput(value);
    };

    const getCharClass = (wIdx, cIdx, char) => {
        if (wIdx < currIndex) {
            const typed = history[wIdx] || '';
            if (cIdx >= typed.length) return '';
            return typed[cIdx] === char ? 'correct' : 'incorrect';
        }
        if (wIdx === currIndex) {
            if (cIdx >= currInput.length) return '';
            return currInput[cIdx] === char ? 'correct' : 'incorrect';
        }
        return '';
    };

    if (!roomData) return <div className="center">Loading Race...</div>;

    return (
        <div className="page-container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
            {/* Progress Bars */}
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--sub-color)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Race Progress</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {Object.entries(roomData.players).map(([id, p]) => (
                        <div key={id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <span style={{ fontWeight: '600', color: p.name === playerName ? 'var(--main-color)' : 'var(--text-color)' }}>
                                    {p.name} {p.name === playerName && '(You)'}
                                </span>
                                <span style={{ color: 'var(--sub-color)' }}>{p.progress}% - {p.wpm} WPM</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${p.progress}%`,
                                    height: '100%',
                                    background: p.name === playerName ? 'var(--main-color)' : 'var(--sub-color)',
                                    transition: 'width 0.3s ease-out',
                                    boxShadow: p.name === playerName ? '0 0 10px var(--main-color)' : 'none'
                                }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Typing Area */}
            <div className="typing-wrapper center" style={{ flexDirection: 'column' }} onClick={() => inputRef.current.focus()}>
                <input
                    ref={inputRef}
                    type="text"
                    autoFocus
                    className="hidden-input"
                    value={currInput}
                    onChange={handleChange}
                    disabled={status === 'finished'}
                />

                <div className="words-container glass-panel" style={{
                    fontSize: '1.5rem',
                    padding: '2rem',
                    lineHeight: '1.8',
                    height: '200px',
                    overflow: 'hidden',
                    fontFamily: 'var(--font-mono)'
                }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {words.map((word, wIdx) => (
                            <div key={wIdx} className={`word ${wIdx === currIndex ? 'active' : ''}`} style={{ display: 'flex' }}>
                                {word.split('').map((char, cIdx) => (
                                    <span key={cIdx} style={{
                                        color: getCharClass(wIdx, cIdx, char) === 'correct' ? 'var(--text-color)' :
                                            getCharClass(wIdx, cIdx, char) === 'incorrect' ? 'var(--error-color)' : 'var(--sub-color)',
                                        borderBottom: (wIdx === currIndex && cIdx === currInput.length) ? '2px solid var(--main-color)' : 'none'
                                    }}>
                                        {char}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {status === 'finished' && (
                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <h2 className="text-gradient">Race Finished!</h2>
                        <button className="btn-primary" onClick={() => navigate('/multiplayer')} style={{ marginTop: '1rem' }}>
                            Back to Lobby
                        </button>
                    </div>
                )}

                {status === 'running' && (
                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <button
                            className="btn-secondary"
                            onClick={() => {
                                socket.emit('leave_room', { roomId });
                                navigate('/multiplayer');
                            }}
                            style={{
                                color: 'var(--error-color)',
                                borderColor: 'rgba(239, 68, 68, 0.2)',
                                background: 'rgba(239, 68, 68, 0.05)'
                            }}
                        >
                            <i className="fas fa-times" style={{ marginRight: '8px' }}></i> Quit Race
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MultiplayerRace;
