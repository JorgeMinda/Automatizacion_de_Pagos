import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { login } from 'wasp/client/auth';
import { AmbientGlow } from '../components/AmbientGlow';
import { GlassCard } from '../components/GlassCard';
import { UtensilsCrossed, Lock, Mail, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      history.push('/parent/dashboard');
    } catch (err: any) {
      setError(err.message || 'Credenciales inválidas. Por favor verifique sus datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05030a] text-zinc-100 flex items-center justify-center p-6 relative selection:bg-[#f72585] selection:text-white">
      <AmbientGlow />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#9d4edd] to-[#f72585] p-[1px] shadow-xl shadow-[#9d4edd]/30 mb-2">
            <div className="w-full h-full bg-[#0a0512] rounded-[15px] flex items-center justify-center">
              <UtensilsCrossed className="w-7 h-7 text-fuchsia-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Acceso al Sistema</h2>
          <p className="text-xs text-zinc-400">Portal Unificado para Padres, Cajeros y Administración</p>
        </div>

        <GlassCard className="p-8" glow="purple">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500/15 border border-red-500/40 rounded-xl text-xs text-red-300">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Correo Electrónico</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@colegio.edu.ec"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Contraseña</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Autenticando...' : 'Entrar al Panel'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};
