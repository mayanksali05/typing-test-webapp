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
    const { wpm, accuracy, errors, totalCharacters, duration, rawWpmHistory, errorMap } = req.body;

    try {
        const newResult = new TypingResult({
            userId: req.userId,
            wpm,
            accuracy,
            errors,
            totalCharacters,
            duration,
            rawWpmHistory,
            errorMap
        });

        await newResult.save();

        // Gamification Logic
        const user = await User.findById(req.userId);
        if (user) {
            // Award XP: base (50) + (wpm * 2) + (accuracy bonus)
            const earnedXp = Math.round(50 + (wpm * 2) + (accuracy > 95 ? 50 : 0));
            user.xp += earnedXp;

            // Level Up logic: Level = floor(sqrt(xp / 100)) + 1
            const nextLevel = Math.floor(Math.sqrt(user.xp / 100)) + 1;
            const leveledUp = nextLevel > user.level;
            user.level = nextLevel;

            // Stats update
            if (wpm > user.stats.bestWpm) user.stats.bestWpm = wpm;
            user.stats.testsCompleted += 1;

            // Achievement Checks
            const currentAchievementCodes = user.achievements.map(a => a.code);
            const newAchievements = [];

            if (wpm >= 80 && !currentAchievementCodes.includes('SPEED_DEMON')) {
                newAchievements.push({ code: 'SPEED_DEMON', name: 'Speed Demon', description: 'Reached 80 WPM' });
            }
            if (wpm >= 100 && !currentAchievementCodes.includes('MASTER')) {
                newAchievements.push({ code: 'MASTER', name: 'Master typer', description: 'Reached 100 WPM' });
            }
            if (accuracy === 100 && duration >= 30 && !currentAchievementCodes.includes('SHARPSHOOTER')) {
                newAchievements.push({ code: 'SHARPSHOOTER', name: 'Sharpshooter', description: '100% Accuracy on 30s+ test' });
            }
            if (user.stats.testsCompleted >= 10 && !currentAchievementCodes.includes('REGULAR')) {
                newAchievements.push({ code: 'REGULAR', name: 'Regular', description: 'Completed 10 tests' });
            }

            if (newAchievements.length > 0) {
                user.achievements.push(...newAchievements);
            }

            await user.save();

            res.json({
                result: newResult,
                rewards: {
                    xp: earnedXp,
                    leveledUp,
                    newLevel: user.level,
                    newAchievements
                }
            });
        } else {
            res.json(newResult);
        }
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
