import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { login } from 'wasp/client/auth';
import { AmbientGlow } from '../components/AmbientGlow';
import { UtensilsCrossed, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ username: email, password });
      navigate('/parent/dashboard');
    } catch (err: any) {
      setError(err.message || 'Credenciales inválidas. Por favor verifique sus datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <AmbientGlow />

      <div className="w-full max-w-md relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 shadow-xl shadow-amber-500/20 mb-2">
            <UtensilsCrossed className="w-7 h-7 text-black font-bold" />
          </Link>
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-display">Acceso al Sistema</h2>
          <p className="text-xs text-zinc-400">Portal Unificado: Padres, Cajeros y Administración</p>
        </div>

        <div className="glass-slab rounded-[32px] p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/15 border border-red-500/40 rounded-2xl text-xs text-red-200">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Correo Electrónico</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-4 top-3.5" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="padre@colegio.edu.ec"
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Contraseña</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-4 top-3.5" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 btn-pill-amber hover:opacity-95 disabled:opacity-50 text-black font-bold text-xs uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Autenticando...' : 'Entrar al Panel'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Login Helper Tags */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest block text-center">
              Credenciales de Prueba (Clic para autocompletar):
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('padre@colegio.edu.ec', 'password123')}
                className="py-1.5 px-2 rounded-xl bg-white/5 hover:bg-amber-500/20 border border-white/10 text-[10px] font-semibold text-amber-300 transition-all text-center"
              >
                Padre
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('cajero@colegio.edu.ec', 'password123')}
                className="py-1.5 px-2 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 text-[10px] font-semibold text-emerald-300 transition-all text-center"
              >
                Cajero
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin@colegio.edu.ec', 'adminpassword')}
                className="py-1.5 px-2 rounded-xl bg-white/5 hover:bg-pink-500/20 border border-white/10 text-[10px] font-semibold text-pink-300 transition-all text-center"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
