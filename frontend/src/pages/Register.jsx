import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            navigate('/verify-email', { state: { email } });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="center" style={{ height: '60vh', flexDirection: 'column' }}>
            <h2 style={{ marginBottom: '20px' }}><i className="fas fa-user-plus"></i> Register</h2>
            {error && <div style={{ color: 'var(--error-color)', marginBottom: '10px' }}>{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px' }}>
                <input
                    type="text"
                    placeholder="Username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ padding: '10px', background: '#2c2e31', borderRadius: '5px' }}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ padding: '10px', background: '#2c2e31', borderRadius: '5px' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ padding: '10px', background: '#2c2e31', borderRadius: '5px' }}
                />
                <button type="submit" style={{ padding: '10px', background: 'var(--main-color)', color: '#2c2e31', borderRadius: '5px', fontWeight: 'bold' }}>
                    Sign Up
                </button>
            </form>
            <p style={{ marginTop: '15px', fontSize: '0.9rem', color: 'var(--sub-color)' }}>
                Already have an account? <Link to="/login" style={{ color: 'var(--main-color)' }}>Login</Link>
            </p>
        </div>
    );
};

export default Register;
