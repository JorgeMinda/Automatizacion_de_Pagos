import React from 'react';
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
export declare const ThemeProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useTheme: () => ThemeContextType;
export {};
//# sourceMappingURL=ThemeContext.d.ts.map