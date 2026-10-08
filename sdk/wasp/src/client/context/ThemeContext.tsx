import React, { createContext, useContext, useEffect, useState } from 'react';

export type ColorAccent = 'rainbow' | 'blue' | 'green' | 'sunset' | 'purple';
export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  accent: ColorAccent;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  setAccent: (accent: ColorAccent) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  isDark: false,
  accent: 'rainbow',
  setMode: () => {},
  toggleMode: () => {},
  setAccent: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('apple_glass_mode');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  const [accent, setAccentState] = useState<ColorAccent>(() => {
    try {
      const saved = localStorage.getItem('apple_glass_accent');
      if (saved) return saved as ColorAccent;
    } catch {}
    return 'rainbow';
  });

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem('apple_glass_mode', newMode);
  };

  const toggleMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  const setAccent = (newAccent: ColorAccent) => {
    setAccentState(newAccent);
    localStorage.setItem('apple_glass_accent', newAccent);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    root.setAttribute('data-theme', mode);
    root.setAttribute('data-accent', accent);
  }, [mode, accent]);

  const isDark = mode === 'dark';

  return (
    <ThemeContext.Provider value={{ mode, isDark, accent, setMode, toggleMode, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
