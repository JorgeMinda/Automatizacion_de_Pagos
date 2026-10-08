import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'purple' | 'pink' | 'cyan' | 'none';
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', glow = 'none' }) => {
  const glowStyles = {
    purple: 'hover:border-violet-500/40 hover:shadow-[0_0_30px_-5px_rgba(157,78,221,0.25)]',
    pink: 'hover:border-pink-500/40 hover:shadow-[0_0_30px_-5px_rgba(247,37,133,0.25)]',
    cyan: 'hover:border-cyan-500/40 hover:shadow-[0_0_30px_-5px_rgba(76,201,240,0.25)]',
    none: ''
  };

  return (
    <div
      className={`bg-[#0a0512]/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-glass-card transition-all duration-300 ${glowStyles[glow]} ${className}`}
    >
      {children}
    </div>
  );
};
