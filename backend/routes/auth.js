const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const TempUser = require('../models/TempUser');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate Verification OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash password before saving to existing TempUser changes or new TempUser
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Check if email already in TempUser, if so update it
        let tempUser = await TempUser.findOne({ email });
        if (tempUser) {
            tempUser.password = hashedPassword;
            tempUser.otp = otp;
            tempUser.name = name;
            tempUser.createdAt = Date.now(); // Reset expiry
            await tempUser.save();
        } else {
            tempUser = new TempUser({
                name,
                email,
                password: hashedPassword,
                otp
            });
            await tempUser.save();
        }

        // Send Email
        await sendEmail({
            to: email,
            subject: 'Email Verification OTP - MonkeyClone',
            text: `Your OTP for email verification is: ${otp}`
        });

        res.status(201).json({ message: 'OTP sent to email', email });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// @route   POST /api/auth/login
// @desc    Login user & return JWTToken
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Optional: Check isVerified if you decide to keep it in schema
        // if (!user.isVerified) { ... }

        const payload = { userId: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// @route   POST /api/auth/verify-email
// @desc    Verify email using OTP
// @access  Public
router.post('/verify-email', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const tempUser = await TempUser.findOne({ email });

        if (!tempUser) {
            return res.status(400).json({ message: 'Invalid or expired OTP request' });
        }

        if (tempUser.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Create actual User
        const user = new User({
            name: tempUser.name,
            email: tempUser.email,
            password: tempUser.password,
            isVerified: true
        });

        // Current password is already hashed in TempUser
        // We must prevent User model pre-save hook from hashing it again
        user.unmarkModified('password');

        await user.save();

        // Remove from TempUser
        await TempUser.deleteOne({ _id: tempUser._id });

        res.json({ message: 'Email verified successfully. You can now login.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// @route   POST /api/auth/forgot-password
// @desc    Send OTP to email
// @access  Public
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordOtp = otp;
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 mins
        await user.save();

        // Send Email
        // Note: In production, use environment variables for email credentials
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const nodemailer = require('nodemailer');
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Password Reset OTP - MonkeyClone',
                text: `Your OTP for password reset is: ${otp}`
            };

            await transporter.sendMail(mailOptions);
        } else {
            console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
        }

        res.json({ message: 'OTP sent to email (Check console if no email creds)' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password using OTP
// @access  Public
router.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const user = await User.findOne({
            email,
            resetPasswordOtp: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.password = newPassword; // Will be hashed by pre-save hook
        user.resetPasswordOtp = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

module.exports = router;
