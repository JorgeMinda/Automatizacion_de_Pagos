import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth, logout } from 'wasp/client/auth';
import { useAction } from 'wasp/client/operations';
import { setUserRole } from 'wasp/client/operations';
import { useTheme } from '../context/ThemeContext';
import { UtensilsCrossed, LayoutDashboard, Store, FileSpreadsheet, LogOut, Sun, Moon, User } from 'lucide-react';
export const Navbar = () => {
    const { data: user } = useAuth();
    const { mode, isDark, toggleMode } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const setUserRoleAction = useAction(setUserRole);
    const [switchingRole, setSwitchingRole] = useState(false);
    const handleSwitchRole = async (newRole) => {
        if (!user || user.role === newRole)
            return;
        setSwitchingRole(true);
        try {
            await setUserRoleAction({ role: newRole });
            if (newRole === 'PADRE')
                navigate('/parent/dashboard');
            else if (newRole === 'CAJERO')
                navigate('/pos/checkout');
            else if (newRole === 'ADMIN')
                navigate('/admin/reports');
            window.location.reload();
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setSwitchingRole(false);
        }
    };
    const isCurrent = (path) => location.pathname.startsWith(path);
    return (<>
      {/* Barra de Navegación Superior Flotante */}
      <nav className="relative z-50 px-3 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between liquid-glass rounded-full px-4 sm:px-5 py-2.5 shadow-xl border border-white/60 dark:border-white/15">
          {/* Logo & Marca Apple Liquid Glass */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl liquid-active-rainbow flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform shrink-0">
              <UtensilsCrossed className="w-4 h-4 text-white drop-shadow-sm"/>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm sm:text-base tracking-tight text-zinc-900 dark:text-white">
                  LUX<span className="text-blue-500 dark:text-blue-400">LUNCH</span>
                </span>
                <span className="text-[8px] sm:text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20">
                  PRO
                </span>
              </div>
              <span className="hidden sm:block text-[9px] text-zinc-500 dark:text-zinc-400 font-mono -mt-0.5 tracking-wider uppercase font-semibold">
                Sistema de Pagos
              </span>
            </div>
          </Link>

          {/* Switchers & Controles Superiores */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* ☀️ / 🌙 Selector Apple Modo Claro & Oscuro */}
            <button type="button" onClick={toggleMode} title={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'} className="p-2 rounded-full liquid-control text-zinc-700 dark:text-zinc-200 hover:text-blue-500 transition-all flex items-center justify-center">
              {isDark ? (<Sun className="w-4 h-4 text-amber-400 animate-fade-in"/>) : (<Moon className="w-4 h-4 text-blue-600 animate-fade-in"/>)}
            </button>

            {user ? (<>
                {/* Enlaces a Portales (Desktop) */}
                <div className="hidden md:flex items-center gap-1 p-1 bg-black/5 dark:bg-white/5 rounded-full border border-black/5 dark:border-white/10">
                  <Link to="/parent/dashboard" className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${isCurrent('/parent/dashboard')
                ? 'liquid-active-blue text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'}`}>
                    <LayoutDashboard className="w-3.5 h-3.5"/>
                    <span>Padres</span>
                  </Link>

                  <Link to="/pos/checkout" className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${isCurrent('/pos/checkout')
                ? 'liquid-active-green text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'}`}>
                    <Store className="w-3.5 h-3.5"/>
                    <span>POS Comedor</span>
                  </Link>

                  <Link to="/admin/reports" className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${isCurrent('/admin/reports')
                ? 'liquid-active-rainbow text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'}`}>
                    <FileSpreadsheet className="w-3.5 h-3.5"/>
                    <span>Admin</span>
                  </Link>
                </div>

                {/* Selector de Rol Rápido Segmented Control Apple */}
                <div className="hidden sm:flex items-center gap-1 p-1 bg-black/5 dark:bg-white/5 rounded-full border border-black/5 dark:border-white/10">
                  <button onClick={() => handleSwitchRole('PADRE')} disabled={switchingRole} className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${user.role === 'PADRE'
                ? 'liquid-active-blue text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}>
                    Padre
                  </button>
                  <button onClick={() => handleSwitchRole('CAJERO')} disabled={switchingRole} className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${user.role === 'CAJERO'
                ? 'liquid-active-green text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}>
                    Cajero
                  </button>
                  <button onClick={() => handleSwitchRole('ADMIN')} disabled={switchingRole} className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${user.role === 'ADMIN'
                ? 'liquid-active-rainbow text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`}>
                    Admin
                  </button>
                </div>

                {/* Botón Logout */}
                <button onClick={() => logout()} title="Cerrar Sesión" className="p-2 rounded-full liquid-control text-zinc-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 transition-all">
                  <LogOut className="w-4 h-4"/>
                </button>
              </>) : (<Link to="/login" className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full liquid-active-blue text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5">
                <User className="w-3.5 h-3.5"/>
                <span>Ingresar</span>
              </Link>)}
          </div>
        </div>
      </nav>

      {/* 📱 Barra de Navegación Flotante Inferior para Móviles (Dock iOS / VisionOS) */}
      {user && (<div className="md:hidden fixed bottom-4 left-4 right-4 z-50 flex justify-center pointer-events-none">
          <div className="pointer-events-auto liquid-glass rounded-full px-4 py-2 shadow-2xl border border-white/70 dark:border-white/20 flex items-center gap-3">
            <Link to="/parent/dashboard" className={`p-2.5 rounded-full flex flex-col items-center justify-center transition-all ${isCurrent('/parent/dashboard')
                ? 'liquid-active-blue text-white shadow-md'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`} title="Portal Padres">
              <LayoutDashboard className="w-5 h-5"/>
              <span className="text-[9px] font-bold mt-0.5">Padres</span>
            </Link>

            <Link to="/pos/checkout" className={`p-2.5 rounded-full flex flex-col items-center justify-center transition-all ${isCurrent('/pos/checkout')
                ? 'liquid-active-green text-white shadow-md'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`} title="POS Comedor">
              <Store className="w-5 h-5"/>
              <span className="text-[9px] font-bold mt-0.5">POS</span>
            </Link>

            <Link to="/admin/reports" className={`p-2.5 rounded-full flex flex-col items-center justify-center transition-all ${isCurrent('/admin/reports')
                ? 'liquid-active-rainbow text-white shadow-md'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'}`} title="Administración">
              <FileSpreadsheet className="w-5 h-5"/>
              <span className="text-[9px] font-bold mt-0.5">Admin</span>
            </Link>
          </div>
        </div>)}
    </>);
};
//# sourceMappingURL=Navbar.jsx.map