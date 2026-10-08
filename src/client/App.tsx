import React from 'react';
import './styles/main.css';

export function App({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#05030a] text-zinc-100 antialiased font-sans">
      {children}
    </div>
  );
}
