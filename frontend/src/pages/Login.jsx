import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="center" style={{ height: '60vh', flexDirection: 'column' }}>
            <h2 style={{ marginBottom: '20px' }}><i className="fas fa-sign-in-alt"></i> Login</h2>
            {error && <div style={{ color: 'var(--error-color)', marginBottom: '10px' }}>{error}</div>}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px' }}>
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
                    Sign In
                </button>
                <div style={{ textAlign: 'right' }}>
                    <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--sub-color)' }}>Forgot Password?</Link>
                </div>
            </form>
            <p style={{ marginTop: '15px', fontSize: '0.9rem', color: 'var(--sub-color)' }}>
                New here? <Link to="/register" style={{ color: 'var(--main-color)' }}>Create account</Link>
            </p>
        </div>
    );
};

export default Login;
