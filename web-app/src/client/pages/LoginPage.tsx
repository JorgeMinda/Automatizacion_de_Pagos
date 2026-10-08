import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { login, signup } from 'wasp/client/auth';
import { useAction } from 'wasp/client/operations';
import { setUserRole } from 'wasp/client/operations';
import { AmbientGlow } from '../components/AmbientGlow';
import { useTheme } from '../context/ThemeContext';
import { UtensilsCrossed, Lock, Mail, ArrowRight, UserPlus, CheckCircle, Sun, Moon, Sparkles, Eye, EyeOff } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { isDark, toggleMode } = useTheme();
  const navigate = useNavigate();
  const setUserRoleAction = useAction(setUserRole);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isRegistering) {
        await signup({ username: email, password });
        setSuccess('¡Cuenta creada exitosamente! Iniciando sesión...');
        await login({ username: email, password });
      } else {
        try {
          await login({ username: email, password });
        } catch (loginErr: any) {
          // Si el usuario aún no existe en Supabase, auto-crear e ingresar
          try {
            await signup({ username: email, password });
            await login({ username: email, password });
            setSuccess('¡Cuenta creada y sesión iniciada!');
          } catch {
            throw loginErr;
          }
        }
      }

      // Sincronizar el rol en la base de datos automáticamente
      if (email.includes('cajero')) {
        try { await setUserRoleAction({ role: 'CAJERO' }); } catch {}
        navigate('/pos/checkout');
      } else if (email.includes('admin') || email.includes('erp') || email.includes('bot')) {
        try { await setUserRoleAction({ role: 'ADMIN' }); } catch {}
        navigate('/admin/reports');
      } else {
        try { await setUserRoleAction({ role: 'PADRE' }); } catch {}
        navigate('/parent/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Error en la autenticación. Verifique sus credenciales o seleccione Registrar Cuenta.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
      <AmbientGlow />

      {/* Botón flotante para cambiar modo */}
      <button
        type="button"
        onClick={toggleMode}
        className="fixed top-6 right-6 p-3 rounded-full liquid-control text-zinc-700 dark:text-zinc-200 z-50 shadow-lg"
        title="Cambiar Modo Claro/Oscuro"
      >
        {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
      </button>

      <div className="w-full max-w-md relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center justify-center w-16 h-16 rounded-3xl liquid-active-rainbow shadow-xl mb-1 group hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-8 h-8 text-white font-bold drop-shadow-sm" />
          </Link>
          <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
            {isRegistering ? 'Crear Cuenta' : 'Acceso al Sistema'}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            Automatización de Pagos y Comedores Escolares
          </p>
        </div>

        <div className="liquid-glass rounded-[36px] p-8 space-y-6 shadow-2xl">
          {/* Tabs: Iniciar Sesión vs Registrarse */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10">
            <button
              type="button"
              onClick={() => { setIsRegistering(false); setError(null); }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                !isRegistering 
                  ? 'liquid-active-blue text-white shadow-sm' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => { setIsRegistering(true); setError(null); }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                isRegistering 
                  ? 'liquid-active-blue text-white shadow-sm' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Registrarse
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-xs font-semibold">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400">Correo Electrónico / Usuario</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="ejemplo@colegio.edu.ec"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400">Contraseña</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-4 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 p-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                  title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 liquid-active-blue text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span>Procesando...</span>
              ) : isRegistering ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Crear Cuenta Oficial</span>
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" />
                  <span>Entrar al Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Accesos Rápidos de Prueba */}
          <div className="pt-2 border-t border-black/5 dark:border-white/10 space-y-2">
            <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500 block text-center">
              Acceso Rápido con 1 Clic
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('padre@colegio.edu.ec', 'password123')}
                className="p-2 rounded-xl liquid-control text-[11px] font-bold text-blue-600 dark:text-blue-400 text-center"
              >
                Padre
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('cajero@colegio.edu.ec', 'password123')}
                className="p-2 rounded-xl liquid-control text-[11px] font-bold text-emerald-600 dark:text-emerald-400 text-center"
              >
                Cajero POS
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('admin@colegio.edu.ec', 'adminpassword')}
                className="p-2 rounded-xl liquid-control text-[11px] font-bold text-purple-600 dark:text-purple-400 text-center"
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
