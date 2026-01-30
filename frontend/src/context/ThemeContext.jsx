import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
    const [font, setFont] = useState(localStorage.getItem('font') || 'sans');
    const [textSize, setTextSize] = useState(localStorage.getItem('textSize') || 'medium');

    useEffect(() => {
        // Apply theme to body/html
        document.documentElement.className = `theme-${theme}`;
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        // Apply font to body
        document.body.style.fontFamily = font === 'mono' ? 'var(--font-mono)' : 'var(--font-sans)';
        localStorage.setItem('font', font);
    }, [font]);

    useEffect(() => {
        // Apply text size
        const sizes = {
            small: '14px',
            medium: '16px',
            large: '20px'
        };
        document.documentElement.style.fontSize = sizes[textSize];
        localStorage.setItem('textSize', textSize);
    }, [textSize]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, font, setFont, textSize, setTextSize }}>
            {children}
        </ThemeContext.Provider>
    );
};
