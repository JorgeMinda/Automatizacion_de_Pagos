import React from 'react';
import { Outlet } from 'react-router';
import './styles/main.css';

export function App() {
  return (
    <div className="min-h-screen bg-[#05030a] text-zinc-100 antialiased font-sans">
      <Outlet />
    </div>
  );
}
