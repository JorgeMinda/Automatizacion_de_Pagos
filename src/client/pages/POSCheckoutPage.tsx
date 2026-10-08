import React, { useState, useEffect } from 'react';
import { useQuery, useAction } from 'wasp/client/operations';
import {
  validateStudentForPOS,
  dispatchMealConsumption,
  getDailyPOSSummary,
  getMenuItemsCatalog
} from 'wasp/client/operations';
import { Navbar } from '../components/Navbar';
import { AmbientGlow } from '../components/AmbientGlow';
import {
  Scan,
  ShieldAlert,
  CheckCircle2,
  AlertOctagon,
  Utensils,
  CreditCard,
  Wifi,
  WifiOff,
  Check
} from 'lucide-react';

export const POSCheckoutPage: React.FC = () => {
  const [identifierInput, setIdentifierInput] = useState('');
  const [selectedSku, setSelectedSku] = useState('PROD-ALM-EJECUTIVO');
  const [showAllergyModal, setShowAllergyModal] = useState(false);
  const [successNotification, setSuccessNotification] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const { data: posSummary, refetch: refetchSummary } = useQuery(getDailyPOSSummary);
  const { data: menuCatalog } = useQuery(getMenuItemsCatalog);
  const { data: validationResult } = useQuery(
    validateStudentForPOS,
    { identifier: identifierInput },
    { enabled: identifierInput.trim().length >= 3 }
  );

  const dispatchMealAction = useAction(dispatchMealConsumption);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleConfirmDispatch = async (forceOverride = false) => {
    if (!validationResult?.student) return;

    const criticalAllergies = validationResult.student.allergies.filter(
      (a: any) => a.severity === 'CRITICO'
    );

    if (criticalAllergies.length > 0 && !forceOverride) {
      setShowAllergyModal(true);
      return;
    }

    try {
      const idempotencyKey = `pos_kiosk_${Date.now()}_${validationResult.student.id}`;

      const res = await dispatchMealAction({
        idempotencyKey,
        studentId: validationResult.student.id,
        menuItemSku: selectedSku,
        posStationId: 'POS_COMEDOR_01',
        forceAllergyOverride: forceOverride
      });

      if (res.success) {
        setSuccessNotification(
          `¡Almuerzo entregado con éxito! ${validationResult.student.firstName} ${validationResult.student.lastName} (${validationResult.student.gradeSection})`
        );
        setIdentifierInput('');
        setShowAllergyModal(false);
        refetchSummary();
        setTimeout(() => setSuccessNotification(null), 3500);
      }
    } catch (err: any) {
      alert(`Fallo en despacho: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen text-zinc-100 relative pb-12">
      <AmbientGlow />
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Barra Superior con Métricas y Estado de Red */}
        <div className="glass-slab rounded-3xl p-6 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-white font-display">
                POS Comedor Escolar • Terminal 01
              </h1>
              {isOnline ? (
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1.5">
                  <Wifi className="w-3 h-3" /> ONLINE (SUPABASE)
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold flex items-center gap-1.5">
                  <WifiOff className="w-3 h-3" /> OFFLINE
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-1 font-light">Despacho atómico de alta velocidad con verificación de alergias</p>
          </div>

          {/* Ribbon de Métricas Diarias */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            <div className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-center min-w-[105px]">
              <span className="text-[10px] text-zinc-400 block uppercase font-mono">Programados</span>
              <span className="text-xl font-mono font-bold text-amber-300">{posSummary?.totalScheduled ?? 0}</span>
            </div>
            <div className="px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center min-w-[105px]">
              <span className="text-[10px] text-emerald-400 block uppercase font-mono">Entregados</span>
              <span className="text-xl font-mono font-bold text-emerald-400">{posSummary?.totalDelivered ?? 0}</span>
            </div>
            <div className="px-4 py-2.5 bg-pink-500/10 border border-pink-500/30 rounded-2xl text-center min-w-[105px]">
              <span className="text-[10px] text-pink-400 block uppercase font-mono">Pendientes</span>
              <span className="text-xl font-mono font-bold text-pink-400">{posSummary?.totalPending ?? 0}</span>
            </div>
          </div>
        </div>

        {/* Notificación Emergente */}
        {successNotification && (
          <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl text-emerald-200 text-sm flex items-center gap-3 backdrop-blur-xl animate-fade-in shadow-xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold">{successNotification}</span>
          </div>
        )}

        {/* Panel Central */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Lado Izquierdo: Escáner y Selección de Menú */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-slab rounded-[32px] p-6 space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center justify-between mb-2">
                  <span>Escanear QR o Código de Alumno</span>
                  <Scan className="w-4 h-4 text-amber-400 animate-pulse" />
                </label>
                <input
                  type="text"
                  autoFocus
                  value={identifierInput}
                  onChange={(e) => setIdentifierInput(e.target.value.toUpperCase())}
                  placeholder="Escanee QR o digite código (ej: EST-101)..."
                  className="w-full px-4 py-4 bg-white/5 border border-amber-400/40 rounded-2xl text-xl font-mono text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all shadow-inner"
                />
              </div>

              {/* Selector de Plato / Servicio */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block">
                  Servicio a Despachar
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {menuCatalog && menuCatalog.length > 0 ? (
                    menuCatalog.map((item: any) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedSku(item.skuPontifico)}
                        className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          selectedSku === item.skuPontifico
                            ? 'btn-pill-amber text-black font-bold shadow-lg shadow-amber-500/30 border-transparent'
                            : 'bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10'
                        }`}
                      >
                        <div>
                          <span className="block text-sm font-semibold">{item.name}</span>
                          <span className="text-[10px] uppercase tracking-wider font-mono opacity-80">
                            {item.type === 'PRODUCIDO' ? 'Plato Producido (BOM)' : 'Insumo Simple'}
                          </span>
                        </div>
                        <span className="font-mono text-sm font-bold">${item.price.toFixed(2)}</span>
                      </button>
                    ))
                  ) : (
                    <button
                      onClick={() => setSelectedSku('PROD-ALM-EJECUTIVO')}
                      className="p-4 rounded-2xl btn-pill-amber text-black font-bold flex justify-between"
                    >
                      <span>Almuerzo Ejecutivo Estándar</span>
                      <span className="font-mono">$3.50</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Lado Derecho: Ficha Visual del Estudiante */}
          <div className="lg:col-span-7">
            {validationResult?.student ? (
              <div className="glass-slab rounded-[32px] p-8 space-y-6 border border-white/20">
                {/* Identidad y Sección Escolar */}
                <div className="flex items-center gap-6 pb-6 border-b border-white/10">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 p-[1px] shadow-lg shadow-amber-500/20 flex items-center justify-center text-3xl font-bold text-black font-display">
                    {validationResult.student.firstName[0]}
                    {validationResult.student.lastName[0]}
                  </div>
                  <div className="space-y-1">
                    <span className="px-3.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-mono text-amber-300 font-bold uppercase">
                      {validationResult.student.gradeSection}
                    </span>
                    <h2 className="text-2xl font-bold text-white font-display">
                      {validationResult.student.firstName} {validationResult.student.lastName}
                    </h2>
                    <p className="text-xs text-zinc-400 font-mono">
                      CÓDIGO ALUMNO: <span className="text-white font-bold">{validationResult.student.staticCode}</span>
                    </p>
                  </div>
                </div>

                {/* Saldos Disponibles */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <span className="text-xs text-zinc-300 uppercase tracking-wider block font-semibold">
                      Paquetes de Almuerzo
                    </span>
                    <div className="text-3xl font-mono font-bold text-emerald-400 mt-1">
                      {validationResult.activePackageUnits}{' '}
                      <span className="text-sm font-sans font-normal text-zinc-400">unidades</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <span className="text-xs text-zinc-300 uppercase tracking-wider block font-semibold">
                      Monedero Cafetería
                    </span>
                    <div className="text-3xl font-mono font-bold text-cyan-400 mt-1">
                      ${validationResult.student.walletBalance.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Advertencia Médica / Alergias */}
                {validationResult.student.allergies.length > 0 && (
                  <div className="p-4 bg-red-500/15 border border-red-500/40 rounded-2xl space-y-2 shadow-lg">
                    <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                      <AlertOctagon className="w-4 h-4" />
                      <span>ALERTA MÉDICA: RESTRICCIONES ALIMENTARIAS</span>
                    </div>
                    <ul className="text-sm text-red-200 list-disc list-inside space-y-1">
                      {validationResult.student.allergies.map((allergy: any) => (
                        <li key={allergy.id}>
                          <strong>{allergy.allergen}:</strong> {allergy.description} (
                          <span className="font-mono font-bold text-red-300">{allergy.severity}</span>)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Botón de Confirmación Principal */}
                <button
                  onClick={() => handleConfirmDispatch(false)}
                  className="w-full py-5 btn-pill-amber text-black font-bold text-base uppercase tracking-wider rounded-full shadow-2xl transition-all transform active:scale-[0.99]"
                >
                  Confirmar Entrega de Almuerzo
                </button>
              </div>
            ) : (
              <div className="h-full min-h-[380px] flex flex-col items-center justify-center p-8 glass-slab rounded-[32px] text-center border-dashed">
                <Utensils className="w-12 h-12 text-zinc-600 mb-3" />
                <h4 className="text-base font-bold text-zinc-300 font-display">Esperando Lectura de Estudiante</h4>
                <p className="text-zinc-400 text-xs mt-1 max-w-sm font-light">
                  Escanee el código QR dinámico o digite el código (ej: <span className="text-amber-400 font-mono font-bold">EST-101</span>) para cargar la ficha.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal Bloqueante de Alergia Crítica */}
      {showAllergyModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="glass-slab rounded-[36px] border-red-500/60 p-8 max-w-md w-full shadow-2xl shadow-red-600/30 space-y-4">
            <div className="flex items-center gap-3 text-red-500">
              <ShieldAlert className="w-8 h-8" />
              <h3 className="text-lg font-bold uppercase font-display">Confirmación de Seguridad Médica</h3>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-light">
              El alumno tiene registradas restricciones alimentarias con nivel <strong>CRÍTICO</strong>. Verifique con el
              equipo de cocina que el plato no contenga alérgenos antes de autorizar la entrega.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAllergyModal(false)}
                className="flex-1 py-3.5 bg-white/10 hover:bg-white/20 text-zinc-300 font-semibold rounded-full text-xs uppercase tracking-wider"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleConfirmDispatch(true)}
                className="flex-1 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-full text-xs uppercase tracking-wider shadow-lg shadow-red-600/40"
              >
                Autorizar Despacho
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
