import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const linkStyle = (path) => ({
        color: isActive(path) ? 'var(--main-color)' : 'var(--sub-color)',
        fontSize: '1.2rem',
        display: 'flex',
        alignItems: 'center',
        transition: 'color 0.2s',
        position: 'relative'
    });

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            marginBottom: '3rem',
            borderRadius: 'var(--radius)',
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
            <div className="logo" style={{ fontSize: '1.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <i className="fas fa-keyboard" style={{ color: 'var(--main-color)' }}></i>
                <Link to="/" style={{ color: 'var(--text-color)', fontFamily: 'var(--font-mono)', letterSpacing: '-1px' }}>TypeFast</Link>
            </div>

            <div className="links" style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                <Link to="/" style={linkStyle('/')} title="Type"><i className="fas fa-keyboard"></i></Link>
                <Link to="/leaderboard" style={linkStyle('/leaderboard')} title="Leaderboard"><i className="fas fa-crown"></i></Link>
                <Link to="/multiplayer" style={linkStyle('/multiplayer')} title="Multiplayer"><i className="fas fa-users"></i></Link>
                <Link to="/about" style={linkStyle('/about')} title="About"><i className="fas fa-info-circle"></i></Link>
                <Link to="/settings" style={linkStyle('/settings')} title="Settings"><i className="fas fa-cog"></i></Link>

                <div style={{ width: '1px', height: '24px', background: 'var(--sub-color)', opacity: 0.3, margin: '0 5px' }}></div>

                {user ? (
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(251, 191, 36, 0.1)', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                            <span style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: 'bold', textTransform: 'uppercase' }}>Lv.</span>
                            <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fbbf24' }}>{user.level}</span>
                        </div>
                        <Link to="/dashboard" style={{
                            color: isActive('/dashboard') ? 'var(--main-color)' : 'var(--text-color)',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <i className="fas fa-user-circle" style={{ fontSize: '1.2rem', opacity: 0.7 }}></i>
                            {user.name}
                        </Link>
                        <button onClick={logout} className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}>
                            <i className="fas fa-sign-out-alt"></i>
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <Link to="/login" className="btn-primary" style={{ fontSize: '0.9rem', padding: '0.5rem 1.2rem', borderRadius: 'var(--radius)' }}>Login</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
