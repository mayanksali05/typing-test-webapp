const mongoose = require('mongoose');

const TypingResultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    wpm: {
        type: Number,
        required: true
    },
    accuracy: {
        type: Number,
        required: true
    },
    errors: {
        type: Number,
        required: true,
        default: 0
    },
    totalCharacters: {
        type: Number,
        required: true
    },
    duration: {
        type: Number, // duration in seconds (15, 30, 60)
        required: true
    },
    rawWpmHistory: [
        {
            time: Number,
            wpm: Number,
            rawWpm: Number,
            accuracy: Number
        }
    ],
    errorMap: {
        type: Map,
        of: Number,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TypingResult', TypingResultSchema);
