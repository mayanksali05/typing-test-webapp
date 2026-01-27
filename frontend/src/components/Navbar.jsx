import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 0',
            marginBottom: '40px'
        }}>
            <div className="logo" style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="https://monkeytype.com/images/logo/logo-128.png" alt="logo" style={{ width: '32px', height: '32px' }} onError={(e) => e.target.style.display = 'none'} />
                <Link to="/" style={{ color: 'var(--text-color)' }}>TypeFast</Link>
            </div>

            <div className="links" style={{ display: 'flex', gap: '20px' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center' }}><i className="fas fa-keyboard"></i><span style={{ marginLeft: '5px' }}>Type</span></Link>
                {user ? (
                    <>
                        <Link to="/dashboard">{user.name}</Link>
                        <button onClick={logout}>Logout</button>
                    </>
                ) : (
                    <Link to="/login"><i className="fas fa-user"></i></Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
