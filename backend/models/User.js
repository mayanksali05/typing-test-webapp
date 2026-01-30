const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordOtp: String,
    resetPasswordExpires: Date,
    isVerified: {
        type: Boolean,
        default: true // Users in this collection are verified by default
    },
    xp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    achievements: [
        {
            code: String,
            name: String,
            description: String,
            unlockedAt: { type: Date, default: Date.now }
        }
    ],
    stats: {
        bestWpm: { type: Number, default: 0 },
        testsCompleted: { type: Number, default: 0 }
    }
}, { timestamps: true });

// Password Hash Middleware
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to validate password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
