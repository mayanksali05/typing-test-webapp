import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
    const { theme, setTheme, font, setFont, textSize, setTextSize } = useTheme();

    return (
        <div className="page-container center">
            <div className="glass-panel" style={{ width: '100%', maxWidth: '600px' }}>
                <h1 className="text-gradient" style={{ marginBottom: '2rem', textAlign: 'center' }}>Settings</h1>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ borderBottom: '1px solid var(--sub-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Appearance</h3>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <span>Theme</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {['dark', 'neon', 'light'].map((t) => (
                                <button
                                    key={t}
                                    className={theme === t ? 'btn-primary' : 'btn-secondary'}
                                    onClick={() => setTheme(t)}
                                    style={{ textTransform: 'capitalize' }}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <span>Font Family</span>
                        <select
                            value={font}
                            onChange={(e) => setFont(e.target.value)}
                            style={{
                                padding: '0.5rem',
                                borderRadius: 'var(--radius)',
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-color)',
                                border: '1px solid var(--sub-color)',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="sans">Inter (Sans)</option>
                            <option value="mono">Roboto Mono (Monospace)</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Text Size</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {['small', 'medium', 'large'].map((s) => (
                                <button
                                    key={s}
                                    className={textSize === s ? 'btn-primary' : 'btn-secondary'}
                                    onClick={() => setTextSize(s)}
                                    style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
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
