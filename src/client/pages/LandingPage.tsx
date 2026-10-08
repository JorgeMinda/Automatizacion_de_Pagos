import React from 'react';
import { Link } from 'react-router';
import { Navbar } from '../components/Navbar';
import { AmbientGlow } from '../components/AmbientGlow';
import { Utensils, ShieldCheck, Zap, MessageSquare, ArrowRight, Sparkles, ChevronRight, Star } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen text-zinc-100 relative pb-16">
      <AmbientGlow />
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-12">
        {/* Floating Luxury Glass Slab (Inspirado en LuxLunch) */}
        <section className="glass-slab rounded-[36px] p-8 sm:p-14 relative overflow-hidden">
          {/* Subtle Ambient Backlight inside the card */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Lado Izquierdo: Contenido & CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Sistema de Automatización de Comedores 2026</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Where nutrition <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500">
                  meets perfection
                </span>
              </h1>

              <p className="text-zinc-300 text-base sm:text-lg max-w-xl leading-relaxed font-light">
                Plataforma de alta fidelidad para control de almuerzos escolares. Acreditación directa a cuenta bancaria,
                reserva de paquetes prepagados, doble entrada contable y sincronización atómica con ERP Pontífico.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  to="/login"
                  className="px-8 py-4 rounded-full font-bold text-sm text-black btn-pill-amber transition-all transform active:scale-95 flex items-center gap-2 uppercase tracking-wider"
                >
                  <span>Acceso Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/pos/checkout"
                  className="px-8 py-4 rounded-full font-semibold text-sm text-zinc-200 btn-pill-glass transition-all flex items-center gap-2"
                >
                  <span>Terminal POS Comedor</span>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                </Link>
              </div>

              {/* Mini Cards Inferiores (Starters / Servicios) */}
              <div className="pt-8 grid grid-cols-2 gap-4 border-t border-white/10">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                    🥗
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Almuerzo Ejecutivo</h4>
                    <span className="text-[10px] text-zinc-400">Paquete Activo $3.50</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                    💳
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Monedero Cafetería</h4>
                    <span className="text-[10px] text-zinc-400">Insumos Simples</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lado Derecho: Plato Showcase Circular & Layered Glass (Mockup 3D) */}
            <div className="lg:col-span-5 flex justify-center relative">
              {/* Círculo de Fondo Neón */}
              <div className="w-72 h-72 sm:w-88 sm:h-88 rounded-full bg-gradient-to-tr from-amber-500/30 via-orange-500/20 to-purple-600/30 p-2 shadow-2xl relative">
                <div className="w-full h-full rounded-full bg-[#0e071a]/80 backdrop-blur-xl border border-white/20 flex items-center justify-center relative overflow-hidden">
                  <span className="text-7xl sm:text-8xl select-none animate-pulse">🍱</span>

                  {/* Badge Flotante Superior */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-white flex items-center gap-1 shadow-lg">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>Calidad Nutricional 100%</span>
                  </div>

                  {/* Badge Flotante Inferior */}
                  <div className="absolute bottom-6 left-6 px-4 py-2 rounded-2xl bg-[#08050e]/80 backdrop-blur-md border border-amber-500/40 text-xs text-white flex items-center gap-2 shadow-xl">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-mono font-bold">Despacho &lt; 3 seg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Triple Frosted Layered Glass (Glass-1, Glass-2, Glass-3 Showcase) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-slab glass-card-hover rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Autogestión sin Esperas</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Sustitución definitiva de recargas manuales en Giftcard Colvi. Los pagos directos se acreditan
              instantáneamente en la cuenta del estudiante.
            </p>
          </div>

          <div className="glass-slab glass-card-hover rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Bot WhatsApp Integrado</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Consulta en tiempo real del menú del día, datos bancarios corporativos y calendario escolar desde WhatsApp
              sin texto plano hardcodeado.
            </p>
          </div>

          <div className="glass-slab glass-card-hover rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Doble Entrada & Alergias</h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              Libro diario contable inmutable, control de alergias severas con alerta bloqueante en mostrador y
              descomposición atómica de recetas hacia Pontífico.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};
