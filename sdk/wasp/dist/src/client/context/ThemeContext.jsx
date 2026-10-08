import React, { createContext, useContext, useEffect, useState } from 'react';
const ThemeContext = createContext({
    mode: 'light',
    isDark: false,
    accent: 'rainbow',
    setMode: () => { },
    toggleMode: () => { },
    setAccent: () => { },
});
export const ThemeProvider = ({ children }) => {
    const [mode, setModeState] = useState(() => {
        try {
            const saved = localStorage.getItem('apple_glass_mode');
            if (saved === 'dark' || saved === 'light')
                return saved;
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        catch {
            return 'light';
        }
    });
    const [accent, setAccentState] = useState(() => {
        try {
            const saved = localStorage.getItem('apple_glass_accent');
            if (saved)
                return saved;
        }
        catch { }
        return 'rainbow';
    });
    const setMode = (newMode) => {
        setModeState(newMode);
        localStorage.setItem('apple_glass_mode', newMode);
    };
    const toggleMode = () => {
        setMode(mode === 'light' ? 'dark' : 'light');
    };
    const setAccent = (newAccent) => {
        setAccentState(newAccent);
        localStorage.setItem('apple_glass_accent', newAccent);
    };
    useEffect(() => {
        const root = document.documentElement;
        if (mode === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
        }
        else {
            root.classList.add('light');
            root.classList.remove('dark');
        }
        root.setAttribute('data-theme', mode);
        root.setAttribute('data-accent', accent);
    }, [mode, accent]);
    const isDark = mode === 'dark';
    return (<ThemeContext.Provider value={{ mode, isDark, accent, setMode, toggleMode, setAccent }}>
      {children}
    </ThemeContext.Provider>);
};
export const useTheme = () => useContext(ThemeContext);
//# sourceMappingURL=ThemeContext.jsx.map