import React, { useState } from 'react';
import { useQuery, useAction } from 'wasp/client/operations';
import { getParentStudentsBalance, processDirectPayment } from 'wasp/client/operations';
import { Navbar } from '../components/Navbar';
import { AmbientGlow } from '../components/AmbientGlow';
import { GlassCard } from '../components/GlassCard';
import { QRCardModal } from '../components/QRCardModal';
import { CreditCard, QrCode, Utensils, AlertTriangle, Check, ShieldCheck, Sparkles } from 'lucide-react';

export const ParentDashboardPage: React.FC = () => {
  const { data: students, isLoading, error, refetch } = useQuery(getParentStudentsBalance);
  const processPaymentAction = useAction(processDirectPayment);

  const [selectedStudentForQR, setSelectedStudentForQR] = useState<any | null>(null);
  const [rechargeModalStudent, setRechargeModalStudent] = useState<any | null>(null);
  const [rechargeType, setRechargeType] = useState<'PAQUETE' | 'MONEDERO'>('PAQUETE');
  const [packageOption, setPackageOption] = useState<number>(20); // 20 almuerzos
  const [walletAmount, setWalletAmount] = useState<number>(25.0);
  const [processing, setProcessing] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleProcessPayment = async () => {
    if (!rechargeModalStudent) return;
    setProcessing(true);

    try {
      const amount = rechargeType === 'PAQUETE' ? packageOption * 3.5 : walletAmount;
      const bankRef = `BANK_DIRECT_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      await processPaymentAction({
        studentId: rechargeModalStudent.id,
        amount,
        destination: rechargeType,
        bankReference: bankRef,
        packageUnits: rechargeType === 'PAQUETE' ? packageOption : undefined,
        unitPrice: 3.5
      });

      setSuccessNotice(`¡Pago acreditado con éxito! Se han asignado los fondos a ${rechargeModalStudent.firstName}.`);
      setRechargeModalStudent(null);
      refetch();
      setTimeout(() => setSuccessNotice(null), 5000);
    } catch (err: any) {
      alert(`Error en procesamiento de pago: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05030a] text-zinc-100 relative selection:bg-[#f72585] selection:text-white pb-16">
      <AmbientGlow />
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-10 space-y-8">
        {/* Header Dashboard */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Portal de Padres y Autogestión
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Monitoreo en tiempo real de paquetes prepagados y saldo de monedero por estudiante.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Acreditación Instantánea Activa
            </span>
          </div>
        </div>

        {/* Notificación de Éxito */}
        {successNotice && (
          <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-200 text-sm flex items-center gap-3 backdrop-blur-xl animate-fade-in">
            <Check className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold">{successNotice}</span>
          </div>
        )}

        {/* Listado de Estudiantes Vinculados */}
        {isLoading ? (
          <div className="py-20 text-center text-zinc-500 font-mono text-sm">Cargando estado de cuentas...</div>
        ) : error ? (
          <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-300 text-sm">
            Error cargando estudiantes: {error.message}
          </div>
        ) : students && students.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {students.map((st: any) => (
              <GlassCard key={st.id} className="p-6 space-y-6" glow="purple">
                {/* Cabecera de Alumno */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 p-[1px] shadow-lg">
                      <div className="w-full h-full bg-[#0a0512] rounded-[15px] flex items-center justify-center font-bold text-lg text-white">
                        {st.firstName[0]}
                        {st.lastName[0]}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {st.firstName} {st.lastName}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-violet-400 font-mono bg-violet-500/10 px-2 py-0.5 rounded-md border border-violet-500/20">
                          {st.gradeSection}
                        </span>
                        <span className="text-xs text-zinc-500 font-mono">ID: {st.staticCode}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedStudentForQR(st)}
                    className="p-3 bg-white/5 hover:bg-violet-600/20 border border-white/10 hover:border-violet-500/40 rounded-xl text-violet-300 transition-all flex items-center gap-2 text-xs font-semibold"
                    title="Ver Carnet QR"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Carnet QR</span>
                  </button>
                </div>

                {/* Doble Saldo: Paquete vs Monedero */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                      <span className="uppercase tracking-wider">Paquete Almuerzos</span>
                      <Utensils className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-2xl font-mono font-bold text-emerald-400">
                      {st.totalAvailableUnits}{' '}
                      <span className="text-xs font-sans text-zinc-400 font-normal">unidades</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 block mt-1">Deducción de 1 almuerzo por día</span>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                      <span className="uppercase tracking-wider">Monedero Cafetería</span>
                      <CreditCard className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="text-2xl font-mono font-bold text-cyan-400">
                      ${st.walletBalance.toFixed(2)}
                    </div>
                    <span className="text-[10px] text-zinc-500 block mt-1">Para compras de insumos simples</span>
                  </div>
                </div>

                {/* Alergias Registradas */}
                {st.allergies && st.allergies.length > 0 && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl space-y-1">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-red-400 uppercase">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Restricción Alimentaria:
                    </div>
                    <p className="text-xs text-red-200">
                      {st.allergies.map((a: any) => `${a.allergen} (${a.description})`).join(' • ')}
                    </p>
                  </div>
                )}

                {/* Botón de Recarga Directa */}
                <button
                  onClick={() => setRechargeModalStudent(st)}
                  className="w-full py-3.5 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:opacity-95 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Comprar Paquetes o Recargar Monedero
                </button>
              </GlassCard>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-[#0a0512]/40 border border-white/10 rounded-3xl space-y-3">
            <Utensils className="w-10 h-10 text-zinc-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No tiene estudiantes asociados</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Comuníquese con la administración del colegio para vincular el código de sus hijos a su cuenta.
            </p>
          </div>
        )}
      </main>

      {/* Modal Carnet QR */}
      {selectedStudentForQR && (
        <QRCardModal
          isOpen={!!selectedStudentForQR}
          onClose={() => setSelectedStudentForQR(null)}
          student={selectedStudentForQR}
        />
      )}

      {/* Modal de Pago / Compra de Paquetes */}
      {rechargeModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0a0512] border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white">
              Acreditar Saldo a {rechargeModalStudent.firstName}
            </h3>

            {/* Pestañas de Tipo de Destino */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
              <button
                onClick={() => setRechargeType('PAQUETE')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  rechargeType === 'PAQUETE' ? 'bg-violet-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Paquete de Almuerzos
              </button>
              <button
                onClick={() => setRechargeType('MONEDERO')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  rechargeType === 'MONEDERO' ? 'bg-fuchsia-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Monedero en Dinero ($)
              </button>
            </div>

            {rechargeType === 'PAQUETE' ? (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                  Seleccione Paquete Prepago (Tarifa: $3.50 / almuerzo)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 20, 40].map((units) => (
                    <button
                      key={units}
                      onClick={() => setPackageOption(units)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        packageOption === units
                          ? 'border-violet-500 bg-violet-600/20 text-white font-bold'
                          : 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10'
                      }`}
                    >
                      <span className="block text-lg font-mono">{units}</span>
                      <span className="text-[10px] uppercase text-zinc-400">Almuerzos</span>
                      <span className="text-xs text-violet-300 font-semibold block mt-1">${(units * 3.5).toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                  Monto a Recargar ($ USD)
                </label>
                <input
                  type="number"
                  min="5"
                  step="5"
                  value={walletAmount}
                  onChange={(e) => setWalletAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-lg font-mono text-white focus:outline-none focus:border-fuchsia-500"
                />
              </div>
            )}

            <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-xs text-zinc-300 space-y-1">
              <div className="flex justify-between font-semibold">
                <span>Total a Pagar Directo:</span>
                <span className="font-mono text-emerald-400 text-sm">
                  ${rechargeType === 'PAQUETE' ? (packageOption * 3.5).toFixed(2) : walletAmount.toFixed(2)}
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 block">
                Liquidación bancaria directa a la cuenta de la empresa sin recargas manuales en Giftcard.
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setRechargeModalStudent(null)}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-zinc-300 font-semibold rounded-xl text-xs uppercase tracking-wider"
              >
                Cancelar
              </button>
              <button
                onClick={handleProcessPayment}
                disabled={processing}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30"
              >
                {processing ? 'Procesando...' : 'Confirmar Pago'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
