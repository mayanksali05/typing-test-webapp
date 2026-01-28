import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.email) {
            setEmail(location.state.email);
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const res = await axios.post('http://localhost:5000/api/auth/verify-email', { email, otp });
            setMessage(res.data.message);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        }
    };

    return (
        <div className="center" style={{ height: '60vh', flexDirection: 'column' }}>
            <h2 style={{ marginBottom: '20px' }}><i className="fas fa-check-circle"></i> Verify Email</h2>
            {message && <div style={{ color: 'var(--main-color)', marginBottom: '10px' }}>{message}</div>}
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
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    style={{ padding: '10px', background: '#2c2e31', borderRadius: '5px' }}
                />
                <div style={{ fontSize: '0.8rem', color: 'var(--sub-color)' }}>Check your email for the OTP.</div>

                <button type="submit" style={{ padding: '10px', background: 'var(--main-color)', color: '#2c2e31', borderRadius: '5px', fontWeight: 'bold' }}>
                    Verify Code
                </button>
            </form>
            <p style={{ marginTop: '15px', fontSize: '0.9rem', color: 'var(--sub-color)' }}>
                <Link to="/login" style={{ color: 'var(--main-color)' }}>Back to Login</Link>
            </p>
        </div>
    );
};

export default VerifyEmail;
