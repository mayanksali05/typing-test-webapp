import React from 'react';

const About = () => {
    return (
        <div className="page-container center">
            <div className="glass-panel" style={{ width: '100%', maxWidth: '700px', lineHeight: '1.6' }}>
                <h1 className="text-gradient" style={{ textAlign: 'center', marginBottom: '2rem' }}>About Typing Test</h1>

                <p style={{ marginBottom: '1.5rem' }}>
                    Welcome to the ultimate typing test experience. Improved and modernized to help you track your progress like never before.
                    Our platform captures your typing speed (WPM) and accuracy with precision, wrapping it all in a sleek, stunning interface.
                </p>

                <h3 style={{ color: 'var(--main-color)' }}>Features</h3>
                <ul style={{ listStylePosition: 'inside', marginBottom: '2rem', color: 'var(--sub-color)' }}>
                    <li style={{ marginBottom: '0.5rem' }}>⚡ Real-time WPM tracking</li>
                    <li style={{ marginBottom: '0.5rem' }}>🎯 Pinpoint accuracy calculation</li>
                    <li style={{ marginBottom: '0.5rem' }}>🏆 Global Leaderboards</li>
                    <li style={{ marginBottom: '0.5rem' }}>🎨 Customizable themes and fonts</li>
                    <li style={{ marginBottom: '0.5rem' }}>📊 Detailed statistics dashboard</li>
                </ul>

                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--sub-color)' }}>
                        Built with ❤️ by the team using React, Vite, and Modern CSS.
                    </p>
                    <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                        <a href="#" style={{ color: 'var(--text-color)' }}>GitHub</a>
                        <a href="#" style={{ color: 'var(--text-color)' }}>Twitter</a>
                        <a href="#" style={{ color: 'var(--text-color)' }}>Discord</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
