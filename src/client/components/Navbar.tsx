import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth, logout } from 'wasp/client/auth';
import { UtensilsCrossed, CreditCard, LayoutDashboard, Store, FileSpreadsheet, LogOut, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { data: user } = useAuth();

  return (
    <nav className="relative z-50 px-6 py-4 border-b border-white/5 bg-[#0a0512]/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo & Marca */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#9d4edd] to-[#f72585] p-[1px] shadow-lg shadow-[#9d4edd]/20 group-hover:shadow-[#f72585]/40 transition-all">
            <div className="w-full h-full bg-[#0a0512] rounded-[11px] flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-fuchsia-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <span className="font-mono text-lg font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-500">
              LUNCH<span className="text-white">PAY</span>
            </span>
            <span className="text-[10px] text-zinc-400 block font-mono -mt-1 tracking-widest">ENTERPRISE SYSTEM</span>
          </div>
        </Link>

        {/* Links de Navegación según Rol */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === 'PADRE' && (
                <Link
                  to="/parent/dashboard"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-violet-400" />
                  Portal de Padres
                </Link>
              )}

              {(user.role === 'CAJERO' || user.role === 'ADMIN') && (
                <Link
                  to="/pos/checkout"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex items-center gap-2"
                >
                  <Store className="w-4 h-4 text-emerald-400" />
                  POS Comedor
                </Link>
              )}

              {user.role === 'ADMIN' && (
                <Link
                  to="/admin/reports"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex items-center gap-2"
                >
                  <FileSpreadsheet className="w-4 h-4 text-pink-400" />
                  Auditoría Ledger
                </Link>
              )}

              {/* Perfil & Logout */}
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-medium text-white block">{user.fullName || user.email}</span>
                  <span className="text-[10px] text-violet-400 font-mono uppercase">{user.role}</span>
                </div>
                <button
                  onClick={() => logout()}
                  title="Cerrar Sesión"
                  className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-300 border border-white/5 hover:border-red-500/30 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-lg shadow-violet-600/30 transition-all uppercase tracking-wider"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
