import React from 'react';
export const GlassCard = ({ children, className = '', glow = 'none' }) => {
    const glowStyles = {
        blue: 'hover:border-blue-500/40 hover:shadow-[0_0_35px_-5px_rgba(0,122,255,0.3)]',
        green: 'hover:border-emerald-500/40 hover:shadow-[0_0_35px_-5px_rgba(52,199,89,0.3)]',
        rainbow: 'hover:border-purple-500/40 hover:shadow-[0_0_35px_-5px_rgba(175,82,222,0.3)]',
        none: ''
    };
    return (<div className={`liquid-glass rounded-[32px] p-6 transition-all duration-300 ${glowStyles[glow]} ${className}`}>
      {children}
    </div>);
};
//# sourceMappingURL=GlassCard.jsx.map