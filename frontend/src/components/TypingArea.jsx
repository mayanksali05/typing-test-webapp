import React, { useState, useEffect, useRef, useMemo } from 'react';
import { generateWords } from '../utils/words';

const TypingArea = ({ timeLimit, onTestEnd }) => {
    const [words, setWords] = useState([]);
    const [currIndex, setCurrIndex] = useState(0);
    const [currInput, setCurrInput] = useState('');
    const [history, setHistory] = useState({}); // { wordIndex: 'typedWord' }
    const [status, setStatus] = useState('waiting');
    const [timeLeft, setTimeLeft] = useState(timeLimit);
    const [correctChars, setCorrectChars] = useState(0);
    const [incorrectChars, setIncorrectChars] = useState(0);

    const inputRef = useRef(null);
    const containerRef = useRef(null);

    // Initialize words
    useEffect(() => {
        resetTest();
    }, [timeLimit]);

    const resetTest = () => {
        setWords(generateWords(100));
        setCurrIndex(0);
        setCurrInput('');
        setHistory({});
        setStatus('waiting');
        setTimeLeft(timeLimit);
        setCorrectChars(0);
        setIncorrectChars(0);
        if (inputRef.current) inputRef.current.focus();
    };

    // Timer
    useEffect(() => {
        let interval;
        if (status === 'running' && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        finishTest();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [status, timeLeft]);

    const finishTest = () => {
        setStatus('finished');
        // Calculate final stats
        // Note: This is a rough calc passed to parent. Parent can recalculate if needed.
        onTestEnd({
            wpm: Math.round((correctChars / 5) / (timeLimit / 60)),
            accuracy: Math.round((correctChars / (correctChars + incorrectChars)) * 100) || 0,
            correctChars,
            incorrectChars,
            totalChars: correctChars + incorrectChars
        });
    };

    const handleKeyDown = (e) => {
        if (status === 'finished') return;
        if (status === 'waiting') setStatus('running');

        // Focus input on any key
        inputRef.current.focus();
    };

    const handleChange = (e) => {
        if (status === 'finished') return;

        const value = e.target.value;

        // Check for space (Next Word)
        if (value.endsWith(' ')) {
            // Commit current word
            const trimmed = value.trim();
            setHistory(prev => ({ ...prev, [currIndex]: trimmed }));

            // Update stats
            const currentWordObj = words[currIndex];
            let correct = 0;
            let incorrect = 0;

            // Compare trimmed input with current word
            // Actually Monkeytype counts characters as you type, but for simplicity:
            // We'll trust the running char count loop below for live stats if we implemented it,
            // but here we update cumulatively on word submit or keeping track live.
            // Let's rely on live tracking for simplicity logic:

            // Actually simpler:
            // Just clear input and move index
            setCurrIndex(prev => prev + 1);
            setCurrInput('');

            // Scroll if needed (simple logic: active word position)
            // Note: Full scrolling logic is complex, avoiding for MVP unless requested.
            // We will scroll the wrapper if active element is far down.

            return;
        }

        setCurrInput(value);

        // Live Stat Update (complex to do perfectly without refactoring, 
        // but we can count total keypresses if we want. 
        // For now, we calculate stats at the end or derived from History + Current Input).
    };

    // Derived calculations for rendering
    const getCharClass = (wIdx, cIdx, char) => {
        if (wIdx < currIndex) {
            // Past words
            const typed = history[wIdx] || '';
            if (cIdx >= typed.length) return ''; // untyped part of word
            return typed[cIdx] === char ? 'correct' : 'incorrect';
        }

        if (wIdx === currIndex) {
            // Current word
            if (cIdx >= currInput.length) return '';
            return currInput[cIdx] === char ? 'correct' : 'incorrect';
        }

        return '';
    };

    // Count correct/incorrect for stats (whenever history/input changes)
    useEffect(() => {
        let c = 0;
        let i = 0;

        // Past words
        Object.keys(history).forEach(idx => {
            const typed = history[idx];
            const target = words[idx];
            for (let k = 0; k < typed.length; k++) {
                if (k < target.length && typed[k] === target[k]) c++;
                else i++; // includes extra chars? For now simplistic
            }
            // extras
            if (typed.length > target.length) i += (typed.length - target.length);
        });

        // Current word
        const target = words[currIndex];
        if (target) {
            for (let k = 0; k < currInput.length; k++) {
                if (k < target.length && currInput[k] === target[k]) c++;
                else i++;
            }
            if (currInput.length > target.length) i += (currInput.length - target.length);
        }

        setCorrectChars(c);
        setIncorrectChars(i);
    }, [history, currInput, currIndex, words]);

    // Handle Scroll
    useEffect(() => {
        const active = containerRef.current?.querySelector('.word.active');
        if (active) {
            active.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
    }, [currIndex]);

    return (
        <div className="typing-wrapper center" style={{ width: '100%', flexDirection: 'column', outline: 'none' }} onClick={() => inputRef.current.focus()}>
            {/* Stats Header */}
            <div className="live-stats" style={{ display: 'flex', gap: '40px', fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--main-color)' }}>
                <div style={{ fontWeight: 'bold' }}>{timeLeft}s</div>
                {status === 'running' && (
                    <div style={{ color: 'var(--sub-color)' }}>
                        {Math.round((correctChars / 5) / ((timeLimit - timeLeft + 0.1) / 60) || 0)} WPM
                    </div>
                )}
            </div>

            <input
                ref={inputRef}
                type="text"
                className="hidden-input"
                value={currInput}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />

            <div
                ref={containerRef}
                className="words-container glass-panel"
                style={{
                    fontSize: '1.8rem',
                    lineHeight: '1.6',
                    height: '160px',
                    overflow: 'hidden',
                    position: 'relative',
                    userSelect: 'none',
                    width: '100%',
                    padding: '1.5rem',
                    fontFamily: 'var(--font-mono)',
                    cursor: 'text',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}
            >
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                    color: 'var(--sub-color)'
                }}>
                    {words.map((word, wIdx) => (
                        <div key={wIdx} className={`word ${wIdx === currIndex ? 'active' : ''}`} style={{ position: 'relative', display: 'flex' }}>
                            {/* Render loop for characters */}
                            {word.split('').map((char, cIdx) => (
                                <span key={cIdx} style={{
                                    color: getCharClass(wIdx, cIdx, char) === 'correct' ? 'var(--text-color)' :
                                        getCharClass(wIdx, cIdx, char) === 'incorrect' ? 'var(--error-color)' : 'inherit',
                                    borderBottom: (wIdx === currIndex && cIdx === currInput.length) ? '2px solid var(--main-color)' : 'none',
                                    transition: 'color 0.1s'
                                }}>
                                    {char}
                                </span>
                            ))}
                            {/* Cursor at end of word if matching length */}
                            {wIdx === currIndex && currInput.length === word.length && (
                                <span style={{ borderLeft: '2px solid var(--main-color)', marginLeft: '2px', animation: 'blink 1s infinite' }}></span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <button
                    onClick={resetTest}
                    className="btn-secondary"
                    style={{
                        padding: '0.8rem 2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '1rem',
                        margin: '0 auto'
                    }}
                >
                    <i className="fas fa-redo"></i> Restart Test
                </button>
            </div>

            <div style={{ marginTop: '20px', color: 'var(--sub-color)', fontSize: '0.9rem', opacity: 0.7 }}>
                <kbd style={{ background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: '4px' }}>Tab</kbd> to restart
            </div>
        </div>
    );
};

export default TypingArea;
