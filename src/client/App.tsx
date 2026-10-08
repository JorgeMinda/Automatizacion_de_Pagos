import React from 'react';
import { Outlet } from 'react-router';
import { ThemeProvider } from './context/ThemeContext';
import './styles/main.css';

export function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen text-zinc-900 dark:text-zinc-100 antialiased font-sans transition-colors duration-300">
        <Outlet />
      </div>
    </ThemeProvider>
  );
}
