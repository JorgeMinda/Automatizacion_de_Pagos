import React from 'react';

export const AmbientGlow: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Glow Superior Izquierdo - Violeta Profundo */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#9d4edd]/15 rounded-full blur-[160px]" />
      
      {/* Glow Centro Derecho - Neón Rosa/Fucsia */}
      <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] bg-[#f72585]/12 rounded-full blur-[180px]" />
      
      {/* Glow Inferior Izquierdo - Cian Neón */}
      <div className="absolute -bottom-40 left-1/4 w-[450px] h-[450px] bg-[#4cc9f0]/10 rounded-full blur-[150px]" />
    </div>
  );
};
