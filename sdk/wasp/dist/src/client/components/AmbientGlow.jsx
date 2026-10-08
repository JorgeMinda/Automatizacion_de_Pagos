import React from 'react';
import { useTheme } from '../context/ThemeContext';
export const AmbientGlow = () => {
    const { isDark } = useTheme();
    return (<div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Luz Refractiva Superior Izquierda (Azul Eléctrico / Cyan Apple) */}
      <div className={`absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[140px] transition-all duration-700 ${isDark
            ? 'bg-blue-600/15'
            : 'bg-blue-400/12'}`}/>

      {/* Luz Refractiva Centro Derecha (Espectro Arcoíris / Rosa / Violeta) */}
      <div className={`absolute top-1/4 -right-32 w-[650px] h-[650px] rounded-full blur-[160px] transition-all duration-700 ${isDark
            ? 'bg-purple-600/12'
            : 'bg-indigo-300/15'}`}/>

      {/* Luz Refractiva Inferior (Verde Esmeralda Apple) */}
      <div className={`absolute -bottom-40 left-1/3 w-[550px] h-[550px] rounded-full blur-[140px] transition-all duration-700 ${isDark
            ? 'bg-emerald-500/12'
            : 'bg-emerald-300/15'}`}/>
    </div>);
};
//# sourceMappingURL=AmbientGlow.jsx.map