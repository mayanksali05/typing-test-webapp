import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setMessage(res.data.message);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/reset-password', {
                email,
                otp,
                newPassword
            });
            setMessage('Password reset successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        }
    };

    return (
        <div className="center" style={{ height: '60vh', flexDirection: 'column' }}>
            <h2 style={{ marginBottom: '20px' }}><i className="fas fa-key"></i> Reset Password</h2>
            {error && <div style={{ color: 'var(--error-color)', marginBottom: '10px' }}>{error}</div>}
            {message && <div style={{ color: 'var(--main-color)', marginBottom: '10px' }}>{message}</div>}

            {step === 1 ? (
                <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px' }}>
                    <div style={{ color: 'var(--sub-color)', fontSize: '0.9rem', marginBottom: '10px' }}>
                        Enter your email to receive an OTP.
                    </div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ padding: '10px', background: '#2c2e31', borderRadius: '5px' }}
                    />
                    <button type="submit" style={{ padding: '10px', background: 'var(--main-color)', color: '#2c2e31', borderRadius: '5px', fontWeight: 'bold' }}>
                        Send OTP
                    </button>
                </form>
            ) : (
                <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px' }}>
                    <div style={{ color: 'var(--sub-color)', fontSize: '0.9rem', marginBottom: '10px' }}>
                        Enter the OTP sent to {email} and your new password.
                    </div>
                    <input
                        type="text"
                        placeholder="OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        style={{ padding: '10px', background: '#2c2e31', borderRadius: '5px' }}
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        style={{ padding: '10px', background: '#2c2e31', borderRadius: '5px' }}
                    />
                    <button type="submit" style={{ padding: '10px', background: 'var(--main-color)', color: '#2c2e31', borderRadius: '5px', fontWeight: 'bold' }}>
                        Reset Password
                    </button>
                    <button type="button" onClick={() => setStep(1)} style={{ fontSize: '0.9rem', color: 'var(--sub-color)' }}>
                        Change Email
                    </button>
                </form>
            )}

            <p style={{ marginTop: '15px', fontSize: '0.9rem', color: 'var(--sub-color)' }}>
                Remembered it? <Link to="/login" style={{ color: 'var(--main-color)' }}>Login</Link>
            </p>
        </div>
    );
};

export default ForgotPassword;
