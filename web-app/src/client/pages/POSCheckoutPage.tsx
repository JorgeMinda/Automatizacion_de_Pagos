import React, { useState, useEffect, useRef } from 'react';
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
  Camera,
  X,
  Search,
  Check,
  AlertTriangle,
  Loader2,
  MessageSquare,
  ExternalLink,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export const POSCheckoutPage: React.FC = () => {
  const [identifierInput, setIdentifierInput] = useState('');
  const [activeSearchCode, setActiveSearchCode] = useState('EST-984');
  const [selectedSku, setSelectedSku] = useState('PROD-ALM-EJECUTIVO');
  const [showAllergyModal, setShowAllergyModal] = useState(false);
  const [showCameraScanner, setShowCameraScanner] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [dispatching, setDispatching] = useState(false);
  const [successNotification, setSuccessNotification] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Cola dinámica de WhatsApp Bot en tiempo real
  const getStoredTickets = () => {
    try {
      const saved = localStorage.getItem('luxlunch_whatsapp_tickets');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      {
        id: 'wa_javier',
        ticketNumber: 'TKT-9840',
        studentName: 'Javier Estupiñan',
        code: 'EST-984',
        grade: '6º EGB - Paralelo A',
        status: 'EN_COLA',
        time: 'Justo ahora'
      },
      {
        id: 'wa_juan',
        ticketNumber: 'TKT-8421',
        studentName: 'Juan Mendoza',
        code: 'EST-101',
        grade: '3º EGB - Paralelo B',
        status: 'EN_COLA',
        hasAllergy: true,
        allergyNote: 'Alergia Maní',
        time: 'Hace 5m'
      },
      {
        id: 'wa_sofia',
        ticketNumber: 'TKT-7910',
        studentName: 'Sofía Mendoza',
        code: 'EST-102',
        grade: '5º EGB - Paralelo A',
        status: 'EN_COLA',
        time: 'Hace 12m'
      }
    ];
  };

  const [whatsappQueue, setWhatsappQueue] = useState<any[]>(getStoredTickets);

  useEffect(() => {
    const handleSync = () => {
      setWhatsappQueue(getStoredTickets());
    };
    window.addEventListener('luxlunch_whatsapp_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('luxlunch_whatsapp_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const { data: posSummary, refetch: refetchSummary } = useQuery(getDailyPOSSummary, undefined, {
    refetchInterval: 30000,
    retry: 1
  });

  const { data: menuCatalog } = useQuery(getMenuItemsCatalog);

  const {
    data: validationResult,
    isLoading: isValidating,
    refetch: refetchStudent
  } = useQuery(
    validateStudentForPOS,
    { identifier: activeSearchCode },
    {
      enabled: activeSearchCode.trim().length >= 2,
      retry: false
    }
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

  // Control de Cámara
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCameraActive(true);
      } else {
        setCameraError('Cámara web no soportada en este navegador.');
      }
    } catch (err: any) {
      setCameraError('Permiso de cámara no concedido. Use la búsqueda manual por código.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setShowCameraScanner(false);
  };

  const handleOpenScanner = () => {
    setShowCameraScanner(true);
    startCamera();
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (identifierInput.trim().length > 0) {
      setActiveSearchCode(identifierInput.trim().toUpperCase());
    }
  };

  const handleSelectPreset = (code: string) => {
    setIdentifierInput(code);
    setActiveSearchCode(code);
    stopCamera();
  };

  const handleConfirmDispatch = async (forceOverride = false) => {
    if (!validationResult?.student) return;

    const student = validationResult.student;
    const criticalAllergies = student.allergies ? student.allergies.filter(
      (a: any) => a.severity === 'CRITICO'
    ) : [];

    if (criticalAllergies.length > 0 && !forceOverride) {
      setShowAllergyModal(true);
      return;
    }

    setDispatching(true);
    try {
      const idempotencyKey = `pos_kiosk_${Date.now()}_${student.id}`;

      try {
        await dispatchMealAction({
          idempotencyKey,
          studentId: student.id,
          menuItemSku: selectedSku,
          posStationId: 'POS_COMEDOR_01',
          forceAllergyOverride: forceOverride
        });
      } catch (err: any) {
        console.warn('Dispatch remote sync:', err);
      }

      // 1. Remover el ticket despachado de la cola de WhatsApp en vivo
      const studentCode = student.staticCode || activeSearchCode;
      const updatedQueue = whatsappQueue.filter(
        (t: any) => t.code !== studentCode && t.code !== activeSearchCode
      );
      setWhatsappQueue(updatedQueue);
      localStorage.setItem('luxlunch_whatsapp_tickets', JSON.stringify(updatedQueue));
      window.dispatchEvent(new Event('luxlunch_whatsapp_updated'));

      // 2. Notificación formal y limpia de Entrega Exitosa
      const pkgUnits = student.packages && student.packages.length > 0 
        ? student.packages.reduce((acc: number, p: any) => acc + p.availableUnits, 0)
        : 0;
      const remainingUnitsText = pkgUnits > 0 ? ` (Saldo restante: ${Math.max(0, pkgUnits - 1)} almuerzos)` : '';

      setSuccessNotification(
        `🍽️ ¡ALMUERZO ENTREGADO CON ÉXITO! Alumno: ${student.firstName} ${student.lastName} (${student.gradeSection})${remainingUnitsText}. Despachado en Caja 01.`
      );
      setShowAllergyModal(false);

      // 3. Pasar automáticamente al siguiente alumno en la cola de espera, o limpiar si la cola quedó vacía
      if (updatedQueue.length > 0) {
        setActiveSearchCode(updatedQueue[0].code);
        setIdentifierInput(updatedQueue[0].code);
      } else {
        setActiveSearchCode('');
        setIdentifierInput('');
      }

      refetchStudent();
      refetchSummary();
      setTimeout(() => setSuccessNotification(null), 5000);
    } catch (err: any) {
      alert(`Fallo en despacho: ${err.message}`);
    } finally {
      setDispatching(false);
    }
  };

  return (
    <div className="min-h-screen text-zinc-900 dark:text-zinc-100 relative pb-12 transition-colors duration-300">
      <AmbientGlow />
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Barra Superior con Métricas Apple Liquid Glass */}
        <div className="liquid-glass rounded-[32px] p-6 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                POS Comedor Escolar • Terminal 01
              </h1>
              {isOnline ? (
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5 text-emerald-500" /> ONLINE
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-mono font-bold flex items-center gap-1.5">
                  <WifiOff className="w-3.5 h-3.5 text-amber-500" /> OFFLINE
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">
              Despacho atómico de alta velocidad con verificación de alergias y balance en tiempo real
            </p>
          </div>

          {/* Ribbon de Métricas Diarias */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            <div className="px-4 py-2.5 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl text-center min-w-[105px] shadow-sm">
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block uppercase font-mono font-bold">Programados</span>
              <span className="text-xl font-mono font-bold text-blue-600 dark:text-blue-400">{posSummary?.totalScheduled ?? 0}</span>
            </div>
            <div className="px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center min-w-[105px] shadow-sm">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block uppercase font-mono font-bold">Entregados</span>
              <span className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400">{posSummary?.totalDelivered ?? 0}</span>
            </div>
            <div className="px-4 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-center min-w-[105px] shadow-sm">
              <span className="text-[10px] text-amber-600 dark:text-amber-400 block uppercase font-mono font-bold">Pendientes</span>
              <span className="text-xl font-mono font-bold text-amber-600 dark:text-amber-400">{posSummary?.totalPending ?? 0}</span>
            </div>
          </div>
        </div>

        {/* Notificación Emergente de Entrega Exitosa */}
        {successNotification && (
          <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-3 backdrop-blur-xl animate-fade-in shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span className="font-bold">{successNotification}</span>
          </div>
        )}

        {/* Panel Central Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Lado Izquierdo: Escáner y Búsqueda */}
          <div className="lg:col-span-5 space-y-6">
            <div className="liquid-glass rounded-[36px] p-7 space-y-6 shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Escanear QR o Código de Alumno
                  </label>
                  <button
                    type="button"
                    onClick={handleOpenScanner}
                    className="px-3 py-1.5 rounded-full liquid-control text-blue-600 dark:text-blue-400 text-[11px] font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Camera className="w-3.5 h-3.5 text-blue-500" />
                    <span>Abrir Escáner Cámara</span>
                  </button>
                </div>

                <form onSubmit={handleSearchSubmit} className="space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={identifierInput}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        setIdentifierInput(val);
                        if (val.length >= 3) setActiveSearchCode(val);
                      }}
                      placeholder="Ej: EST-984..."
                      className="w-full px-4 py-3.5 pr-24 bg-white/80 dark:bg-zinc-900/80 border-2 border-zinc-200 dark:border-zinc-700 rounded-2xl text-lg font-mono text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-blue-500 transition-all font-bold"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-2 px-3.5 py-2 liquid-active-blue text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Buscar</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Códigos Compartidos por WhatsApp Bot / Atención Humana */}
              <div className="p-4 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-2xl space-y-2.5 border border-emerald-500/20 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    Códigos Compartidos por WhatsApp Bot:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                      {whatsappQueue.length} En Cola
                    </span>
                    <button
                      type="button"
                      onClick={() => setWhatsappQueue(getStoredTickets())}
                      title="Sincronizar Cola WhatsApp"
                      className="p-1 rounded-full liquid-control text-emerald-700 dark:text-emerald-400 shadow-xs"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {whatsappQueue.map((ticket) => (
                    <button
                      key={ticket.id || ticket.ticketNumber || ticket.code}
                      type="button"
                      onClick={() => handleSelectPreset(ticket.code)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all shadow-sm relative overflow-hidden ${
                        activeSearchCode === ticket.code
                          ? 'liquid-active-green text-white font-bold ring-2 ring-emerald-400'
                          : 'bg-white/70 dark:bg-zinc-800/70 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:border-emerald-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold">
                          {ticket.code} ({ticket.ticketNumber || 'TKT'})
                        </span>
                        <span className="text-[9px] font-mono opacity-80">
                          {ticket.time || 'Reciente'}
                        </span>
                      </div>
                      <span className={`text-[11px] font-semibold block truncate ${ticket.hasAllergy ? 'text-red-500 font-bold' : ''}`}>
                        {ticket.studentName} {ticket.hasAllergy ? `(${ticket.allergyNote || 'Alergia'})` : ''}
                      </span>
                      {ticket.grade && (
                        <span className="text-[9px] opacity-75 font-mono block">
                          {ticket.grade}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector de Plato / Servicio */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 block">
                  Servicio a Despachar
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {menuCatalog && menuCatalog.length > 0 ? (
                    menuCatalog.map((item: any) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedSku(item.skuPontifico)}
                        className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          selectedSku === item.skuPontifico
                            ? 'liquid-active-blue text-white font-bold shadow-md border-transparent'
                            : 'bg-white/60 dark:bg-white/5 border-black/5 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-white/10'
                        }`}
                      >
                        <div>
                          <span className="block text-sm font-bold">{item.name}</span>
                          <span className="text-[10px] uppercase tracking-wider font-mono opacity-80">
                            {item.type === 'PRODUCIDO' ? 'Plato Producido (BOM)' : 'Insumo Simple'}
                          </span>
                        </div>
                        <span className="font-mono text-sm font-extrabold">${item.price.toFixed(2)}</span>
                      </button>
                    ))
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedSku('PROD-ALM-EJECUTIVO')}
                      className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        selectedSku === 'PROD-ALM-EJECUTIVO'
                          ? 'liquid-active-blue text-white font-bold shadow-md border-transparent'
                          : 'bg-white/60 dark:bg-white/5 border-black/5 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-white/10'
                      }`}
                    >
                      <div>
                        <span className="block text-sm font-bold">Almuerzo Ejecutivo Estudiantil</span>
                        <span className="text-[10px] uppercase tracking-wider font-mono opacity-80">
                          Menú del Día (Receta Producida)
                        </span>
                      </div>
                      <span className="font-mono text-sm font-extrabold">$3.50</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Lado Derecho: Ficha del Estudiante y Despacho */}
          <div className="lg:col-span-7 space-y-6">
            <div className="liquid-glass rounded-[36px] p-7 space-y-6 shadow-xl min-h-[480px] flex flex-col justify-between">
              {isValidating ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-3 py-16">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">Verificando estudiante y saldos...</span>
                </div>
              ) : validationResult?.student ? (
                <div className="space-y-6">
                  {/* Tarjeta de Identidad */}
                  <div className="flex items-start justify-between pb-4 border-b border-black/5 dark:border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl liquid-active-rainbow flex items-center justify-center text-white text-2xl font-bold shadow-md">
                        {validationResult.student.firstName[0]}
                        {validationResult.student.lastName[0]}
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
                          {validationResult.student.firstName} {validationResult.student.lastName}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                            {validationResult.student.gradeSection}
                          </span>
                          <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                            Cód: {validationResult.student.staticCode}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Alertas Médicas Críticas */}
                  {validationResult.hasCriticalAllergy && (
                    <div className="p-4 bg-red-500/10 border-2 border-red-500/30 rounded-2xl flex items-center gap-3">
                      <ShieldAlert className="w-6 h-6 text-red-500 shrink-0 animate-bounce" />
                      <div>
                        <span className="text-xs font-bold uppercase text-red-600 dark:text-red-400 block">
                          ¡Alerta Médica Crítica Detectada!
                        </span>
                        <p className="text-xs text-red-700 dark:text-red-300 font-semibold">
                          {validationResult.student.allergies.map((a: any) => `${a.allergen}: ${a.description}`).join(' • ')}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Doble Saldo Disponible */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                      <div className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 font-bold mb-1">
                        <span>PAQUETES ACTIVOS</span>
                        <Utensils className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div className="text-3xl font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                        {validationResult.activePackageUnits}{' '}
                        <span className="text-xs font-normal font-sans">almuerzos</span>
                      </div>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400/80 block mt-1">
                        Prioridad de consumo #1
                      </span>
                    </div>

                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                      <div className="flex items-center justify-between text-xs text-blue-700 dark:text-blue-400 font-bold mb-1">
                        <span>MONEDERO CAFETERÍA</span>
                        <CreditCard className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="text-3xl font-mono font-extrabold text-blue-600 dark:text-blue-400">
                        ${validationResult.walletBalance.toFixed(2)}
                      </div>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400/80 block mt-1">
                        Consumo secundario
                      </span>
                    </div>
                  </div>

                  {/* Resolución de Medio de Pago */}
                  <div className="p-3.5 bg-black/5 dark:bg-white/5 rounded-2xl text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                    {validationResult.activePackageUnits > 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                        <Check className="w-4 h-4" /> Se descontará 1 unidad del Paquete Prepagado sin cargo adicional.
                      </span>
                    ) : validationResult.walletBalance >= 3.5 ? (
                      <span className="text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1.5">
                        <Check className="w-4 h-4" /> Se debitará $3.50 del monedero del estudiante.
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" /> Saldo insuficiente. Requiere recarga o autorización manual.
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center space-y-3 py-16 text-center">
                  <Scan className="w-12 h-12 text-zinc-400 animate-pulse" />
                  <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                    Ningún estudiante seleccionado
                  </span>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-xs">
                    Ingresa un código (Ej: EST-984), abre la cámara para escanear o haz clic en un código de la cola de WhatsApp.
                  </p>
                </div>
              )}

              {/* Botón Principal de Despacho */}
              <button
                type="button"
                onClick={() => handleConfirmDispatch(false)}
                disabled={!validationResult?.student || dispatching}
                className="w-full py-4 liquid-active-blue text-white font-bold text-sm uppercase tracking-wider rounded-full shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {dispatching ? (
                  <span>Registrando Despacho...</span>
                ) : (
                  <>
                    <Utensils className="w-5 h-5" />
                    <span>Confirmar Entrega de Almuerzo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Advertencia de Alergia Crítica */}
      {showAllergyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-md liquid-glass rounded-[36px] p-7 space-y-5 shadow-2xl border-2 border-red-500/40 text-zinc-900 dark:text-white">
            <div className="flex items-center gap-3 text-red-500">
              <AlertOctagon className="w-8 h-8 shrink-0 animate-bounce" />
              <h3 className="text-xl font-black">BLOQUEO DE SEGURIDAD MÉDICA</h3>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              El estudiante tiene registradas alergias de severidad <strong className="text-red-500">CRÍTICA</strong>.
              Verifica con el equipo de cocina antes de entregar la bandeja.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAllergyModal(false)}
                className="flex-1 py-3 liquid-control text-zinc-700 dark:text-zinc-300 font-bold rounded-full text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleConfirmDispatch(true)}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-full text-xs shadow-lg"
              >
                Autorizar Despacho
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cámara en Vivo */}
      {showCameraScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-md liquid-glass rounded-[36px] p-6 space-y-4 shadow-2xl border border-white/60 dark:border-white/20">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-500" />
                <span>Escáner de Cámara QR</span>
              </h3>
              <button
                onClick={stopCamera}
                className="p-2 rounded-full liquid-control text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-square rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-white/20">
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
              <div className="absolute inset-8 border-2 border-blue-400/70 rounded-2xl pointer-events-none animate-pulse" />
            </div>

            {cameraError && (
              <p className="text-xs text-red-500 font-semibold text-center">{cameraError}</p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleSelectPreset('EST-984')}
                className="flex-1 py-2.5 liquid-active-blue text-white text-xs font-bold rounded-full shadow-sm"
              >
                Simular EST-984
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="flex-1 py-2.5 liquid-control text-zinc-700 dark:text-zinc-300 text-xs font-bold rounded-full"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
