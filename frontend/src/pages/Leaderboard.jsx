import React from 'react';

const Leaderboard = () => {
    // Mock data for leaderboard
    const leaders = [
        { rank: 1, username: 'speedDeamon', wpm: 120, accuracy: '99%', date: '2023-10-25' },
        { rank: 2, username: 'typemaster99', wpm: 115, accuracy: '98%', date: '2023-10-24' },
        { rank: 3, username: 'keyboardWarrior', wpm: 110, accuracy: '97%', date: '2023-10-26' },
        { rank: 4, username: 'devTyper', wpm: 105, accuracy: '96%', date: '2023-10-20' },
        { rank: 5, username: 'fastFingers', wpm: 100, accuracy: '95%', date: '2023-10-22' },
        { rank: 6, username: 'codeNinja', wpm: 98, accuracy: '98%', date: '2023-10-21' },
        { rank: 7, username: 'bugSlayer', wpm: 95, accuracy: '94%', date: '2023-10-23' },
        { rank: 8, username: 'reactPro', wpm: 92, accuracy: '97%', date: '2023-10-19' },
        { rank: 9, username: 'vimUser', wpm: 90, accuracy: '99%', date: '2023-10-18' },
        { rank: 10, username: 'coffeelover', wpm: 88, accuracy: '92%', date: '2023-10-17' },
    ];

    return (
        <div className="page-container center">
            <div className="glass-panel" style={{ width: '100%', maxWidth: '800px' }}>
                <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '2rem' }}>Leaderboard</h1>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-color)' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--sub-color)' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--main-color)' }}>Rank</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--main-color)' }}>User</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--main-color)' }}>WPM</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--main-color)' }}>Accuracy</th>
                                <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--main-color)' }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaders.map((leader) => (
                                <tr key={leader.rank} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        {leader.rank === 1 ? '🥇' : leader.rank === 2 ? '🥈' : leader.rank === 3 ? '🥉' : `#${leader.rank}`}
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{leader.username}</td>
                                    <td style={{ padding: '1rem' }}>{leader.wpm}</td>
                                    <td style={{ padding: '1rem' }}>{leader.accuracy}</td>
                                    <td style={{ padding: '1rem', color: 'var(--sub-color)' }}>{leader.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
