import React, { useState } from 'react';

const Settings = () => {
    const [theme, setTheme] = useState('dark');
    const [font, setFont] = useState('sans');
    const [textSize, setTextSize] = useState('medium');

    return (
        <div className="page-container center">
            <div className="glass-panel" style={{ width: '100%', maxWidth: '600px' }}>
                <h1 className="text-gradient" style={{ marginBottom: '2rem', textAlign: 'center' }}>Settings</h1>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ borderBottom: '1px solid var(--sub-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Appearance</h3>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <span>Theme</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                className={theme === 'dark' ? 'btn-primary' : 'btn-secondary'}
                                onClick={() => setTheme('dark')}
                            >
                                Dark
                            </button>
                            <button
                                className={theme === 'neon' ? 'btn-primary' : 'btn-secondary'}
                                onClick={() => setTheme('neon')}
                            >
                                Neon
                            </button>
                            <button
                                className={theme === 'light' ? 'btn-primary' : 'btn-secondary'}
                                onClick={() => setTheme('light')}
                            >
                                Light
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <span>Font Family</span>
                        <select
                            value={font}
                            onChange={(e) => setFont(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: 'var(--radius)', background: 'var(--bg-secondary)', color: 'var(--text-color)', border: '1px solid var(--sub-color)' }}
                        >
                            <option value="sans">Inter (Sans)</option>
                            <option value="mono">Roboto Mono (Monospace)</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Text Size</span>
                        <input
                            type="range"
                            min="12"
                            max="24"
                            value={textSize === 'small' ? 14 : textSize === 'medium' ? 18 : 22}
                            onChange={() => { }} // Placeholder
                            style={{ width: '150px' }}
                        />
                    </div>
                </div>

                <div>
                    <h3 style={{ borderBottom: '1px solid var(--sub-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Account</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Danger Zone</span>
                        <button style={{ color: 'var(--error-color)', border: '1px solid var(--error-color)' }} className="btn-secondary">
                            Delete Account
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Settings;
