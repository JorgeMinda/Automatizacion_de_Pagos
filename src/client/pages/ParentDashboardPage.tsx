import React, { useState } from 'react';
import { useQuery, useAction } from 'wasp/client/operations';
import { getParentStudentsBalance, processDirectPayment, registerStudentForParent } from 'wasp/client/operations';
import { Navbar } from '../components/Navbar';
import { AmbientGlow } from '../components/AmbientGlow';
import { QRCardModal } from '../components/QRCardModal';
import { CreditCard, QrCode, Utensils, AlertTriangle, Check, Sparkles, PlusCircle, UserPlus, X, ShieldCheck } from 'lucide-react';

export const ParentDashboardPage: React.FC = () => {
  const { data: students, isLoading, error, refetch } = useQuery(getParentStudentsBalance);
  const processPaymentAction = useAction(processDirectPayment);
  const registerStudentAction = useAction(registerStudentForParent);

  const [selectedStudentForQR, setSelectedStudentForQR] = useState<any | null>(null);
  const [rechargeModalStudent, setRechargeModalStudent] = useState<any | null>(null);
  const [rechargeType, setRechargeType] = useState<'PAQUETE' | 'MONEDERO'>('PAQUETE');
  const [packageOption, setPackageOption] = useState<number>(20);
  const [walletAmount, setWalletAmount] = useState<number>(25.0);
  const [processing, setProcessing] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Sincronización dinámica de datos bancarios con la configuración del Administrador
  const [bankConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('luxlunch_bank_config');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      bankName: 'Banco Pichincha',
      accountType: 'Cuenta Corriente',
      accountNumber: '2100849201',
      holderName: 'LUXLUNCH CATERING ESCOLAR S.A.S.',
      ruc: '1792345678001',
      whatsappProof: '+593 99 876 5432',
      qrPayload: 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=00020101021126480014ec.banco.pichincha011021008492015204481453038405802EC5918LUXLUNCH+CATERING6005QUITO'
    };
  });

  // Modal para agregar estudiante
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newGrade, setNewGrade] = useState('6º EGB - Paralelo A');
  const [newAllergen, setNewAllergen] = useState('');
  const [creatingStudent, setCreatingStudent] = useState(false);

  const handleRegisterStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingStudent(true);
    try {
      await registerStudentAction({
        firstName: newFirstName,
        lastName: newLastName,
        gradeSection: newGrade,
        allergen: newAllergen
      });
      setShowAddStudentModal(false);
      setNewFirstName('');
      setNewLastName('');
      setNewAllergen('');
      setSuccessNotice('¡Estudiante registrado con éxito en el sistema!');
      refetch();
      setTimeout(() => setSuccessNotice(null), 4000);
    } catch (err: any) {
      alert(`Error al registrar estudiante: ${err.message}`);
    } finally {
      setCreatingStudent(false);
    }
  };

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
    <div className="min-h-screen text-zinc-900 dark:text-zinc-100 relative pb-16 transition-colors duration-300">
      <AmbientGlow />
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        {/* Header Dashboard Apple Liquid Glass */}
        <div className="liquid-glass rounded-[32px] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-bold uppercase tracking-wider border border-blue-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Portal Familiar Apple Liquid Glass</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Gestión de Almuerzos Escolares
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-normal">
              Monitoreo en tiempo real de paquetes prepagados y saldo de monedero por estudiante.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddStudentModal(true)}
              className="px-5 py-3 rounded-full liquid-active-blue text-white text-xs font-bold flex items-center gap-2 shadow-lg transition-all transform hover:scale-105"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Registrar Estudiante</span>
            </button>
          </div>
        </div>

        {/* Notificación de Éxito */}
        {successNotice && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-3 backdrop-blur-xl animate-fade-in shadow-md">
            <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold">{successNotice}</span>
          </div>
        )}

        {/* Modal para Agregar Estudiante */}
        {showAddStudentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/70 backdrop-blur-xl animate-fade-in">
            <div className="w-full max-w-md liquid-glass rounded-[36px] p-8 space-y-6 shadow-2xl border border-white/70 dark:border-white/20 relative">
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full liquid-control text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
                  Registrar Estudiante
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Ingresa los datos del alumno para vincularlo a tu cuenta y generar su carnet digital.
                </p>
              </div>

              <form onSubmit={handleRegisterStudent} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400">Nombre</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Javier"
                      value={newFirstName}
                      onChange={(e) => setNewFirstName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/80 dark:bg-zinc-900/80 border border-zinc-300 dark:border-zinc-700 rounded-2xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400">Apellido</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Estupiñan"
                      value={newLastName}
                      onChange={(e) => setNewLastName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/80 dark:bg-zinc-900/80 border border-zinc-300 dark:border-zinc-700 rounded-2xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400">Grado y Sección</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 6º EGB - Paralelo A"
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/80 dark:bg-zinc-900/80 border border-zinc-300 dark:border-zinc-700 rounded-2xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400">Restricciones / Alergias (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej. Maní, Gluten, Lactosa"
                    value={newAllergen}
                    onChange={(e) => setNewAllergen(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/80 dark:bg-zinc-900/80 border border-zinc-300 dark:border-zinc-700 rounded-2xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddStudentModal(false)}
                    className="flex-1 py-3 liquid-control text-zinc-700 dark:text-zinc-300 font-bold rounded-full text-xs uppercase tracking-wider transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={creatingStudent}
                    className="flex-1 py-3 liquid-active-blue text-white font-bold rounded-full text-xs uppercase tracking-wider shadow-lg transition-all"
                  >
                    {creatingStudent ? 'Guardando...' : 'Guardar Alumno'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Listado de Estudiantes Vinculados */}
        {isLoading ? (
          <div className="py-20 text-center text-zinc-500 dark:text-zinc-400 font-mono text-sm">
            Cargando estado de cuentas escolares...
          </div>
        ) : error ? (
          <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-700 dark:text-red-400 text-sm">
            Error cargando estudiantes: {error.message}
          </div>
        ) : students && students.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {students.map((st: any) => (
              <div key={st.id} className="liquid-glass rounded-[36px] p-7 space-y-6">
                {/* Cabecera de Alumno */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl liquid-active-rainbow shadow-md flex items-center justify-center font-bold text-xl text-white">
                      {st.firstName[0]}
                      {st.lastName[0]}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                        {st.firstName} {st.lastName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-blue-700 dark:text-blue-300 font-bold bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                          {st.gradeSection}
                        </span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono font-semibold">
                          ID: {st.staticCode}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedStudentForQR(st)}
                    className="p-3 liquid-control rounded-2xl text-blue-600 dark:text-blue-400 transition-all flex items-center gap-2 text-xs font-bold shadow-sm"
                    title="Ver Carnet QR"
                  >
                    <QrCode className="w-4 h-4 text-blue-500" />
                    <span>Carnet QR</span>
                  </button>
                </div>

                {/* Doble Saldo: Paquete vs Monedero */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Paquete Almuerzos (Activo Verde Apple) */}
                  <div className="p-4 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                      <span className="uppercase tracking-wider font-bold">Paquete Almuerzos</span>
                      <Utensils className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-2xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                      {st.totalAvailableUnits}{' '}
                      <span className="text-xs font-sans text-zinc-500 dark:text-zinc-400 font-normal">unidades</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block mt-1">
                      1 almuerzo / día lectivo
                    </span>
                  </div>

                  {/* Monedero Cafetería (Activo Azul Apple) */}
                  <div className="p-4 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                      <span className="uppercase tracking-wider font-bold">Monedero Cafetería</span>
                      <CreditCard className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="text-2xl font-mono font-extrabold text-blue-600 dark:text-blue-400">
                      ${st.walletBalance.toFixed(2)}
                    </div>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block mt-1">
                      Insumos simples y cafetería
                    </span>
                  </div>
                </div>

                {/* Alergias Registradas */}
                {st.allergies && st.allergies.length > 0 && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl space-y-1">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-red-600 dark:text-red-400 uppercase">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Restricción Alimentaria:
                    </div>
                    <p className="text-xs text-red-700 dark:text-red-300 font-semibold">
                      {st.allergies.map((a: any) => `${a.allergen} (${a.description})`).join(' • ')}
                    </p>
                  </div>
                )}

                {/* Botón de Recarga Directa */}
                <button
                  onClick={() => setRechargeModalStudent(st)}
                  className="w-full py-4 liquid-active-blue text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <PlusCircle className="w-4 h-4" />
                  Comprar Paquetes o Recargar Monedero
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center liquid-glass rounded-[36px] space-y-4 shadow-xl">
            <Utensils className="w-12 h-12 text-blue-500 mx-auto animate-bounce" />
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                No tienes estudiantes asociados aún
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                Registra a tus hijos para autogestionar recargas, compartir su carnet por WhatsApp y monitorear sus almuerzos.
              </p>
            </div>
            <button
              onClick={() => setShowAddStudentModal(true)}
              className="px-6 py-3.5 liquid-active-blue text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg transition-all transform hover:scale-105 inline-flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Registrar a mi Primer Estudiante</span>
            </button>
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

      {/* Modal de Pago / Compra de Paquetes con QR Oficial de Transferencia */}
      {rechargeModalStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/70 backdrop-blur-xl animate-fade-in overflow-y-auto">
          <div className="w-full max-w-lg liquid-glass rounded-[36px] p-7 space-y-5 shadow-2xl border border-white/70 dark:border-white/20 my-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
                  Recargar Saldo • {rechargeModalStudent.firstName}
                </h3>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                  Código Alumno: {rechargeModalStudent.staticCode} ({rechargeModalStudent.gradeSection})
                </span>
              </div>
              <button
                onClick={() => setRechargeModalStudent(null)}
                className="p-2 rounded-full liquid-control text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Pestañas de Selección: Paquete vs Monedero */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10">
              <button
                onClick={() => setRechargeType('PAQUETE')}
                className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
                  rechargeType === 'PAQUETE' 
                    ? 'liquid-active-blue text-white shadow-sm' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                Paquete de Almuerzos
              </button>
              <button
                onClick={() => setRechargeType('MONEDERO')}
                className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
                  rechargeType === 'MONEDERO' 
                    ? 'liquid-active-blue text-white shadow-sm' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                Monedero Cafetería ($)
              </button>
            </div>

            {rechargeType === 'PAQUETE' ? (
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400 block">
                  Selecciona la cantidad de almuerzos:
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[10, 20, 30].map((units) => (
                    <button
                      key={units}
                      onClick={() => setPackageOption(units)}
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        packageOption === units
                          ? 'liquid-active-green text-white font-bold shadow-md'
                          : 'bg-white/60 dark:bg-white/5 border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-white/10'
                      }`}
                    >
                      <span className="block text-lg font-bold">{units}</span>
                      <span className="text-[10px] block opacity-80">Almuerzos</span>
                      <span className="text-xs font-mono font-bold mt-1 block">
                        ${(units * 3.5).toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400 block">
                  Monto a recargar en monedero:
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[15.0, 25.0, 50.0].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setWalletAmount(amt)}
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        walletAmount === amt
                          ? 'liquid-active-blue text-white font-bold shadow-md'
                          : 'bg-white/60 dark:bg-white/5 border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-white/10'
                      }`}
                    >
                      <span className="block text-lg font-bold font-mono">${amt.toFixed(2)}</span>
                      <span className="text-[10px] block opacity-80">Saldo Monedero</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Caja de Datos de Transferencia y QR Oficial */}
            <div className="p-4 bg-white/60 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-zinc-900 dark:text-white block">
                    {bankConfig.bankName} • {bankConfig.accountType}
                  </span>
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                    Cta: {bankConfig.accountNumber}
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">
                    {bankConfig.holderName} (RUC: {bankConfig.ruc})
                  </span>
                </div>
                {bankConfig.qrPayload && (
                  <div className="p-1.5 bg-white rounded-xl shadow-sm border border-black/5 shrink-0">
                    <img
                      src={bankConfig.qrPayload}
                      alt="QR Transferencia"
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Botón de Confirmación */}
            <button
              onClick={handleProcessPayment}
              disabled={processing}
              className="w-full py-4 liquid-active-blue text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-xl transition-all flex items-center justify-center gap-2"
            >
              {processing ? (
                <span>Acreditando Pago...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>
                    Confirmar Recarga de $
                    {(rechargeType === 'PAQUETE' ? packageOption * 3.5 : walletAmount).toFixed(2)}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
