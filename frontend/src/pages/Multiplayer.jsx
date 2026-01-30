import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import socket from '../socket';
import { useAuth } from '../context/AuthContext';

const Multiplayer = () => {
    const [roomId, setRoomId] = useState('');
    const [roomData, setRoomData] = useState(null);
    const [playerName, setPlayerName] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) setPlayerName(user.name);

        socket.on('room_update', (data) => {
            setRoomData(data);
        });

        socket.on('race_started', ({ words }) => {
            navigate(`/multiplayer/race/${roomId}`, { state: { words, roomId, playerName: playerName || 'Guest' } });
        });

        return () => {
            socket.off('room_update');
            socket.off('race_started');
        };
    }, [user, roomId, navigate, playerName]);

    const handleJoinRoom = () => {
        if (!roomId.trim()) return alert('Please enter a Room ID');
        socket.emit('join_room', { roomId, playerName: playerName || 'Guest' });
    };

    const handleStartRace = () => {
        const words = ['the', 'be', 'of', 'and', 'a', 'to', 'in', 'he', 'have', 'it']; // Simplified for now, or use generateWords
        // Actually let's use the generator but ensure everyone gets the same
        import('../utils/words').then(({ generateWords }) => {
            const sharedWords = generateWords(50);
            socket.emit('start_race', { roomId, words: sharedWords });
        });
    };

    return (
        <div className="page-container center" style={{ flexDirection: 'column' }}>
            <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '500px' }}>
                <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '2rem' }}>Multiplayer Race</h1>

                {!roomData ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--sub-color)' }}>Player Name</label>
                            <input
                                type="text"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                placeholder="Enter your name"
                                className="glass-panel"
                                style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.2)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--sub-color)' }}>Room ID</label>
                            <input
                                type="text"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                placeholder="Enter Room ID to join or create"
                                className="glass-panel"
                                style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.2)' }}
                            />
                        </div>
                        <button className="btn-primary" onClick={handleJoinRoom} style={{ marginTop: '1rem', width: '100%' }}>
                            Join / Create Room
                        </button>
                    </div>
                ) : (
                    <div>
                        <div style={{ marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.2rem', color: 'var(--sub-color)', marginBottom: '1rem' }}>Room: <span style={{ color: 'var(--main-color)' }}>{roomId}</span></h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                {Object.values(roomData.players).map((p, idx) => (
                                    <div key={idx} className="glass-panel" style={{ padding: '0.8rem 1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)' }}>
                                        <span style={{ fontWeight: '600' }}>{p.name} {p.name === playerName && '(You)'}</span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--success-color)' }}>Ready</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {Object.keys(roomData.players).length >= 1 && (
                            <button className="btn-primary" onClick={handleStartRace} style={{ width: '100%' }}>
                                Start Race
                            </button>
                        )}

                        <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--sub-color)', textAlign: 'center' }}>
                            Waiting for other players to join...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Multiplayer;
