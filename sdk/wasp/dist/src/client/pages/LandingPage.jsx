import React from 'react';
import { Link } from 'react-router';
import { Navbar } from '../components/Navbar';
import { AmbientGlow } from '../components/AmbientGlow';
import { ArrowRight, Sparkles, ChevronRight, Star } from 'lucide-react';
export const LandingPage = () => {
    return (<div className="min-h-screen text-zinc-900 dark:text-zinc-100 relative pb-16 transition-colors duration-300">
      <AmbientGlow />
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-10">
        {/* Floating Apple Liquid Glass Slab */}
        <section className="liquid-glass rounded-[40px] p-8 sm:p-14 relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Lado Izquierdo: Titular & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5"/>
                <span>Apple Liquid Glass UI/UX Edition</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
                Nutrición escolar <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">
                  con precisión óptica
                </span>
              </h1>

              <p className="text-zinc-600 dark:text-zinc-300 text-base sm:text-lg max-w-xl leading-relaxed font-normal">
                Plataforma de alta fidelidad para control y pago de almuerzos escolares. Autogestión bancaria directa,
                reserva de paquetes prepagados, doble entrada contable y sincronización automática con ERP Pontífico.
              </p>

              {/* Botones de Acción */}
              <div className="flex flex-wrap items-center gap-4 pt-3">
                <Link to="/login" className="px-8 py-4 rounded-full text-sm font-bold liquid-active-blue text-white shadow-xl transition-all transform active:scale-95 flex items-center gap-2 uppercase tracking-wider">
                  <span>Acceso al Portal</span>
                  <ArrowRight className="w-4 h-4"/>
                </Link>

                <Link to="/pos/checkout" className="px-8 py-4 rounded-full font-bold text-sm liquid-control text-zinc-700 dark:text-zinc-200 transition-all flex items-center gap-2 shadow-sm">
                  <span>Terminal POS Comedor</span>
                  <ChevronRight className="w-4 h-4 text-zinc-400"/>
                </Link>
              </div>

              {/* Mini Cards Inferiores */}
              <div className="pt-8 grid grid-cols-2 gap-4 border-t border-black/5 dark:border-white/10">
                <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center gap-3 shadow-sm">
                  <div className="w-11 h-11 rounded-xl liquid-active-green flex items-center justify-center text-xl shadow-md">
                    🥗
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Almuerzo Ejecutivo</h4>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">Paquete Activo $3.50</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center gap-3 shadow-sm">
                  <div className="w-11 h-11 rounded-xl liquid-active-blue flex items-center justify-center text-xl shadow-md">
                    💳
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white">Monedero Cafetería</h4>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold">Insumos Simples</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lado Derecho: Showcase Circular */}
            <div className="lg:col-span-5 flex justify-center relative">
              <div className="w-72 h-72 sm:w-88 sm:h-88 rounded-full liquid-glass p-3 shadow-2xl relative flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-white/60 dark:bg-zinc-900/60 backdrop-blur-2xl border border-white/80 dark:border-white/20 flex items-center justify-center relative overflow-hidden shadow-inner">
                  <span className="text-7xl sm:text-8xl select-none animate-pulse">🍱</span>

                  {/* Badge Superior */}
                  <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full liquid-glass text-[11px] font-bold text-zinc-900 dark:text-white flex items-center gap-1.5 shadow-md">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500"/>
                    <span>Calidad 100%</span>
                  </div>

                  {/* Badge Inferior */}
                  <div className="absolute bottom-6 left-6 px-4 py-2 rounded-2xl liquid-active-green text-xs text-white flex items-center gap-2 shadow-xl font-mono font-bold">
                    <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping"/>
                    <span>Despacho &lt; 3 seg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>);
};
//# sourceMappingURL=LandingPage.jsx.map