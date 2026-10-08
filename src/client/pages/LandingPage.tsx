import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { AmbientGlow } from '../components/AmbientGlow';
import { GlassCard } from '../components/GlassCard';
import { ShieldCheck, Zap, MessageSquare, QrCode, Cpu, CheckCircle } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#05030a] text-zinc-100 relative selection:bg-[#f72585] selection:text-white">
      <AmbientGlow />
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-16 space-y-24">
        {/* Hero Section */}
        <section className="text-center space-y-6 max-w-4xl mx-auto pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-violet-500/30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#f72585] animate-ping" />
            <span className="text-xs font-mono tracking-widest text-violet-300 uppercase">
              Plataforma Transaccional 2026
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Control de Almuerzos Escolares con{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-500">
              Cero Fricción y Pago Directo
            </span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Elimina las recargas manuales y colas en comedor. Integración nativa con ERP Pontífico, Bot de WhatsApp y
            doble saldo inteligente en tiempo real.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              to="/parent/dashboard"
              className="px-8 py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:opacity-95 shadow-lg shadow-violet-600/30 transition-all uppercase tracking-wider"
            >
              Portal de Padres
            </Link>
            <Link
              to="/pos/checkout"
              className="px-8 py-4 rounded-xl font-bold text-sm text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all uppercase tracking-wider"
            >
              Terminal POS Comedor
            </Link>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-8 space-y-4" glow="purple">
            <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Acreditación Inmediata</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Pagos directos a la cuenta bancaria corporativa con asignación instantánea en el monedero o paquete de
              almuerzo sin esperas administrativas.
            </p>
          </GlassCard>

          <GlassCard className="p-8 space-y-4" glow="pink">
            <div className="w-12 h-12 rounded-xl bg-pink-600/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Bot WhatsApp Autónomo</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Consulta en vivo del menú escolar, datos bancarios oficiales y calendario lectivo sin intervención humana,
              directamente desde la base de datos central.
            </p>
          </GlassCard>

          <GlassCard className="p-8 space-y-4" glow="cyan">
            <div className="w-12 h-12 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Integridad y Seguridad Médica</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Ledger de doble entrada inmutable, control de alergias severas con alerta bloqueante en caja y
              sincronización atómica con ERP Pontífico.
            </p>
          </GlassCard>
        </section>
      </main>
    </div>
  );
};
