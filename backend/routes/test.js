const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const TypingResult = require('../models/TypingResult');
const User = require('../models/User');

// Middleware to verify token
const auth = (req, res, next) => {
    const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// @route   POST /api/test/save
// @desc    Save typing test result
// @access  Private
router.post('/save', auth, async (req, res) => {
    const { wpm, accuracy, errors, totalCharacters, duration } = req.body;

    try {
        const newResult = new TypingResult({
            userId: req.userId,
            wpm,
            accuracy,
            errors,
            totalCharacters,
            duration
        });

        const savedResult = await newResult.save();
        res.json(savedResult);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/test/history
// @desc    Get user test history
// @access  Private
router.get('/history', auth, async (req, res) => {
    try {
        const history = await TypingResult.find({ userId: req.userId }).sort({ createdAt: -1 });

        // Calculate stats
        let totalWpm = 0;
        let totalAccuracy = 0;
        let bestWpm = 0;

        if (history.length > 0) {
            history.forEach(test => {
                totalWpm += test.wpm;
                totalAccuracy += test.accuracy;
                if (test.wpm > bestWpm) bestWpm = test.wpm;
            });

            const avgWpm = (totalWpm / history.length).toFixed(1);
            const avgAccuracy = (totalAccuracy / history.length).toFixed(1);

            res.json({
                history,
                stats: {
                    bestWpm,
                    avgWpm,
                    avgAccuracy,
                    testsTaken: history.length
                }
            });
        } else {
            res.json({ history: [], stats: null });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
