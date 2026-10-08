import React from 'react';
import { Link } from 'react-router';
import { useAuth, logout } from 'wasp/client/auth';
import { UtensilsCrossed, LayoutDashboard, Store, FileSpreadsheet, LogOut, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { data: user } = useAuth();

  return (
    <nav className="relative z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-slab rounded-2xl px-6 py-3">
        {/* Logo & Marca (LuxLunch Style) */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-4 h-4 text-black font-bold" />
          </div>
          <div>
            <span className="font-display text-lg font-bold tracking-tight text-white">
              LUX<span className="text-amber-400">LUNCH</span>
            </span>
            <span className="text-[9px] text-zinc-400 block font-mono -mt-1 tracking-widest uppercase">
              Comedores Escolares
            </span>
          </div>
        </Link>

        {/* Links de Navegación según Rol */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {user.role === 'PADRE' && (
                <Link
                  to="/parent/dashboard"
                  className="px-4 py-2 rounded-full text-xs font-semibold text-zinc-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                  Portal Padres
                </Link>
              )}

              {(user.role === 'CAJERO' || user.role === 'ADMIN') && (
                <Link
                  to="/pos/checkout"
                  className="px-4 py-2 rounded-full text-xs font-semibold text-zinc-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2"
                >
                  <Store className="w-3.5 h-3.5 text-emerald-400" />
                  POS Comedor
                </Link>
              )}

              {user.role === 'ADMIN' && (
                <Link
                  to="/admin/reports"
                  className="px-4 py-2 rounded-full text-xs font-semibold text-zinc-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-pink-400" />
                  Auditoría Ledger
                </Link>
              )}

              {/* Perfil & Logout */}
              <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-semibold text-white block">{user.fullName || user.email}</span>
                  <span className="text-[10px] text-amber-400 font-mono uppercase">{user.role}</span>
                </div>
                <button
                  onClick={() => logout()}
                  title="Cerrar Sesión"
                  className="p-2 rounded-full bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-300 border border-white/10 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2.5 rounded-full text-xs font-bold text-black btn-pill-amber transition-all uppercase tracking-wider flex items-center gap-2"
            >
              <span>Acceder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
