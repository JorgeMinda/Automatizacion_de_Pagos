import React, { useState, useEffect } from 'react';
import { useQuery, useAction } from 'wasp/client/operations';
import { getAdminLedgerAudit, getMenuItemsCatalog, createMenuItemRecipe } from 'wasp/client/operations';
import { Navbar } from '../components/Navbar';
import { AmbientGlow } from '../components/AmbientGlow';
import {
  FileSpreadsheet,
  Database,
  ArrowDownLeft,
  ArrowUpRight,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Layers,
  MessageSquare,
  CheckCircle2,
  Calendar,
  Utensils,
  Cpu,
  RefreshCw,
  Clock,
  UserCheck,
  Plus,
  QrCode,
  CreditCard,
  Building,
  Check,
  X,
  Copy,
  Sparkles
} from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ledger' | 'menu' | 'bank_qr' | 'pontifico' | 'tickets'>('ledger');
  const { data: ledgerEntries, isLoading: loadingLedger, error: errorLedger } = useQuery(getAdminLedgerAudit);
  const { data: menuCatalog, isLoading: loadingMenu, refetch: refetchMenu } = useQuery(getMenuItemsCatalog);
  const createMenuAction = useAction(createMenuItemRecipe);

  // Estado del Modal para Nuevo Plato / Receta
  const [showCreateMenuModal, setShowCreateMenuModal] = useState(false);
  const [newSku, setNewSku] = useState('');
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState(3.50);
  const [newType, setNewType] = useState<'PRODUCIDO' | 'SIMPLE'>('PRODUCIDO');
  const [newProtein, setNewProtein] = useState('RAW-PROTEIN-CHICKEN');
  const [newGrain, setNewGrain] = useState('RAW-GRAIN-RICE');
  const [newVeg, setNewVeg] = useState('RAW-VEG-SALAD');
  const [savingMenu, setSavingMenu] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Datos de Configuración Bancaria y QR Oficial (con persistencia en localStorage)
  const [bankConfig, setBankConfig] = useState(() => {
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
      qrPayload: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021126480014ec.banco.pichincha011021008492015204481453038405802EC5918LUXLUNCH+CATERING6005QUITO'
    };
  });

  // Modal de Edición de Cuenta Bancaria y QR
  const [showEditBankModal, setShowEditBankModal] = useState(false);
  const [editBankName, setEditBankName] = useState(bankConfig.bankName);
  const [editAccountType, setEditAccountType] = useState(bankConfig.accountType);
  const [editAccountNumber, setEditAccountNumber] = useState(bankConfig.accountNumber);
  const [editHolderName, setEditHolderName] = useState(bankConfig.holderName);
  const [editRuc, setEditRuc] = useState(bankConfig.ruc);
  const [editWhatsapp, setEditWhatsapp] = useState(bankConfig.whatsappProof);
  const [editQrPayload, setEditQrPayload] = useState(bankConfig.qrPayload);

  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleOpenEditBankModal = () => {
    setEditBankName(bankConfig.bankName);
    setEditAccountType(bankConfig.accountType);
    setEditAccountNumber(bankConfig.accountNumber);
    setEditHolderName(bankConfig.holderName);
    setEditRuc(bankConfig.ruc);
    setEditWhatsapp(bankConfig.whatsappProof);
    setEditQrPayload(bankConfig.qrPayload);
    setShowEditBankModal(true);
  };

  const handleSaveBankConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      bankName: editBankName.trim(),
      accountType: editAccountType.trim(),
      accountNumber: editAccountNumber.trim(),
      holderName: editHolderName.trim(),
      ruc: editRuc.trim(),
      whatsappProof: editWhatsapp.trim(),
      qrPayload: editQrPayload.trim() || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TRANSFER_${editBankName}_${editAccountNumber}_${editRuc}`
    };
    setBankConfig(updated);
    try {
      localStorage.setItem('luxlunch_bank_config', JSON.stringify(updated));
    } catch {}
    setShowEditBankModal(false);
    setSuccessMessage('¡Datos bancarios y código QR de transferencias actualizados exitosamente!');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Tickets de WhatsApp derivados del Bot (Opción 5 y Carnets Compartidos)
  const getInitialTickets = () => {
    const defaultList = [
      {
        id: 'TKT-9840',
        parentName: 'Padre de Familia',
        studentName: 'Javier Estupiñan (6º EGB A - EST-984)',
        phone: bankConfig.whatsappProof || '+593 99 876 5432',
        reason: 'Carnet Digital Compartido para Validación de Almuerzos',
        time: 'Hace 1 min',
        status: 'PENDIENTE',
      },
      {
        id: 'TKT-8421',
        parentName: 'Carlos Mendoza',
        studentName: 'Juan Mendoza (5º EGB B - EST-101)',
        phone: '+593 99 876 5432',
        reason: 'Consulta sobre cambio de menú por intolerancia leve',
        time: 'Hace 12 min',
        status: 'PENDIENTE',
      },
      {
        id: 'TKT-7910',
        parentName: 'Patricia Silva',
        studentName: 'Sofía Silva (3º BGU A - EST-102)',
        phone: '+593 98 112 3344',
        reason: 'Confirmación de factura con RUC empresarial',
        time: 'Hace 35 min',
        status: 'EN_PROCESO',
      },
    ];

    try {
      const saved = localStorage.getItem('luxlunch_whatsapp_tickets');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mapped = parsed.map((item: any) => ({
            id: item.ticketNumber || `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
            parentName: item.studentName ? `Tutor de ${item.studentName}` : 'Padre de Familia',
            studentName: `${item.studentName} (${item.grade || 'Primaria'} - ${item.code || ''})`,
            phone: item.phone || bankConfig.whatsappProof || '+593 99 876 5432',
            reason: item.reason || 'Carnet Digital Compartido para Validación',
            time: item.time || 'Reciente',
            status: item.status === 'RESUELTO' ? 'RESUELTO' : 'PENDIENTE'
          }));
          return mapped;
        }
      }
    } catch {}
    return defaultList;
  };

  const [tickets, setTickets] = useState(getInitialTickets);

  useEffect(() => {
    const handleSync = () => {
      setTickets(getInitialTickets());
    };
    window.addEventListener('luxlunch_whatsapp_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('luxlunch_whatsapp_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [bankConfig]);

  const handleResolveTicket = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'RESUELTO' } : t))
    );
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleCreateMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSku || !newName) return;

    setSavingMenu(true);
    try {
      const bomItems =
        newType === 'PRODUCIDO'
          ? [
              { rawMaterialSku: newProtein, quantity: 0.12, unit: 'KG' },
              { rawMaterialSku: newGrain, quantity: 0.08, unit: 'KG' },
              { rawMaterialSku: newVeg, quantity: 0.1, unit: 'KG' }
            ]
          : [];

      await createMenuAction({
        skuPontifico: newSku.trim().toUpperCase(),
        name: newName.trim(),
        price: Number(newPrice),
        type: newType,
        recipeBOM: bomItems
      });

      setShowCreateMenuModal(false);
      setNewSku('');
      setNewName('');
      setSuccessMessage('¡Plato y receta BOM creados exitosamente!');
      refetchMenu();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      alert(`Error creando menú: ${err.message}`);
    } finally {
      setSavingMenu(false);
    }
  };

  return (
    <div className="min-h-screen text-zinc-900 dark:text-zinc-100 relative pb-16 transition-colors duration-300">
      <AmbientGlow />
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        {/* Header Consola Administrativa Apple Liquid Glass */}
        <div className="liquid-glass rounded-[32px] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-bold uppercase tracking-wider border border-blue-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Consola Integral Apple Liquid Glass</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
              Gestión Financiera & Operativa
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-normal">
              Auditoría de Partida Doble, Catálogo de Recetas BOM, Banco QR y Sincronización ERP Pontífico.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>ACID Ledger Safe</span>
            </span>
          </div>
        </div>

        {/* Notificación de Éxito */}
        {successMessage && (
          <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-3 backdrop-blur-xl animate-fade-in shadow-md">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="font-bold">{successMessage}</span>
          </div>
        )}

        {/* Pestañas de Navegación Segmented Control Apple */}
        <div className="flex items-center gap-2 p-1.5 liquid-glass rounded-2xl overflow-x-auto border border-black/5 dark:border-white/10 shadow-sm">
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'ledger'
                ? 'liquid-active-blue text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Libro Mayor Partida Doble</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'menu'
                ? 'liquid-active-blue text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Menús & Recetas BOM</span>
          </button>

          <button
            onClick={() => setActiveTab('bank_qr')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'bank_qr'
                ? 'liquid-active-blue text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Cuentas Bancarias & QR</span>
          </button>

          <button
            onClick={() => setActiveTab('pontifico')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'pontifico'
                ? 'liquid-active-blue text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Sincronización ERP</span>
          </button>

          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'tickets'
                ? 'liquid-active-rainbow text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Tickets WhatsApp ({tickets.filter(t => t.status === 'PENDIENTE').length})</span>
          </button>
        </div>

        {/* Tab 1: Libro Mayor Partida Doble */}
        {activeTab === 'ledger' && (
          <div className="liquid-glass rounded-[36px] p-7 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/5 dark:border-white/10">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-500" />
                  Auditoría Financiera en Tiempo Real
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Cada transacción se registra con partida doble inmutable cumpliendo con estándares contables internacionales.
                </p>
              </div>
            </div>

            {loadingLedger ? (
              <div className="py-16 text-center text-zinc-500 dark:text-zinc-400 font-mono text-sm">
                Cargando asientos contables...
              </div>
            ) : errorLedger ? (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-700 dark:text-red-400 text-xs">
                Error cargando libro mayor: {errorLedger.message}
              </div>
            ) : ledgerEntries && ledgerEntries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-black/10 dark:border-white/10 text-[11px] uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">
                      <th className="py-3 px-3">Fecha</th>
                      <th className="py-3 px-3">Asiento / ID</th>
                      <th className="py-3 px-3">Cuenta Contable</th>
                      <th className="py-3 px-3">Estudiante</th>
                      <th className="py-3 px-3">Descripción</th>
                      <th className="py-3 px-3 text-right">Debe (Débito)</th>
                      <th className="py-3 px-3 text-right">Haber (Crédito)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5 font-mono">
                    {ledgerEntries.map((entry: any) => (
                      <tr key={entry.id} className="hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                        <td className="py-3 px-3 text-zinc-600 dark:text-zinc-400">
                          {new Date(entry.createdAt).toLocaleDateString()} {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 px-3 font-bold text-blue-600 dark:text-blue-400">
                          {entry.id.slice(-8).toUpperCase()}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 font-semibold text-zinc-700 dark:text-zinc-300">
                            {entry.account?.type || 'GENERAL'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-zinc-900 dark:text-zinc-100 font-sans font-medium">
                          {entry.account?.student ? `${entry.account.student.firstName} ${entry.account.student.lastName}` : 'N/A'}
                        </td>
                        <td className="py-3 px-3 text-zinc-600 dark:text-zinc-400 font-sans">
                          {entry.description}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                          {entry.debitAmount > 0 ? `$${entry.debitAmount.toFixed(2)}` : '-'}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-amber-600 dark:text-amber-400">
                          {entry.creditAmount > 0 ? `$${entry.creditAmount.toFixed(2)}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-zinc-400 dark:text-zinc-500 text-xs">
                No hay transacciones contables registradas aún.
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Catálogo de Menús & Fórmulas BOM */}
        {activeTab === 'menu' && (
          <div className="liquid-glass rounded-[36px] p-7 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/5 dark:border-white/10">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-blue-500" />
                  Catálogo de Menús & Fórmulas de Descargue BOM
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Costeo de materias primas y recetas sincronizadas con el portal de padres y terminales POS.
                </p>
              </div>

              <button
                onClick={() => setShowCreateMenuModal(true)}
                className="px-4 py-2.5 rounded-full liquid-active-blue text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Nuevo Plato / Receta</span>
              </button>
            </div>

            {loadingMenu ? (
              <div className="py-16 text-center text-zinc-500 dark:text-zinc-400 font-mono text-sm">
                Cargando recetas y productos...
              </div>
            ) : menuCatalog && menuCatalog.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {menuCatalog.map((item: any) => (
                  <div key={item.id} className="p-5 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl space-y-3 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">
                          SKU: {item.skuPontifico}
                        </span>
                        <h4 className="text-base font-bold text-zinc-900 dark:text-white mt-0.5">
                          {item.name}
                        </h4>
                      </div>
                      <span className="text-lg font-mono font-extrabold text-zinc-900 dark:text-white">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        item.type === 'PRODUCIDO'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                      }`}>
                        {item.type === 'PRODUCIDO' ? 'Receta BOM Producida' : 'Insumo Simple'}
                      </span>
                    </div>

                    {item.recipeBOM && item.recipeBOM.length > 0 && (
                      <div className="pt-2 border-t border-black/5 dark:border-white/5 space-y-1">
                        <span className="text-[10px] font-bold uppercase text-zinc-400 block">Fórmula de Descargue:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.recipeBOM.map((bom: any, idx: number) => (
                            <span key={idx} className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 text-zinc-600 dark:text-zinc-300">
                              {bom.rawMaterialSku}: {bom.quantity} {bom.unit}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-zinc-400 dark:text-zinc-500 text-xs">
                No hay productos en catálogo aún. Haz clic en "+ Nuevo Plato / Receta" para agregar uno.
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Cuentas Bancarias & QR de Recargas */}
        {activeTab === 'bank_qr' && (
          <div className="liquid-glass rounded-[36px] p-7 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/5 dark:border-white/10">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-500" />
                  Cuentas Bancarias & QR Oficial de Recargas
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Los datos configurados aquí se muestran automáticamente a los padres para transferencias y notificaciones de WhatsApp.
                </p>
              </div>

              <button
                onClick={handleOpenEditBankModal}
                className="px-4 py-2.5 rounded-full liquid-active-blue text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Editar Datos Bancarios y QR</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* QR Oficial */}
              <div className="md:col-span-4 p-6 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-3xl text-center space-y-3 shadow-sm">
                <div className="p-3 bg-white rounded-2xl inline-block shadow-sm">
                  <img
                    src={bankConfig.qrPayload}
                    alt="QR Oficial"
                    className="w-48 h-48 object-contain"
                  />
                </div>
                <div>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white block">
                    {bankConfig.holderName}
                  </span>
                  <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                    RUC: {bankConfig.ruc}
                  </span>
                </div>
              </div>

              {/* Detalles de la Cuenta */}
              <div className="md:col-span-8 space-y-3">
                <div className="p-4 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">Banco</span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">{bankConfig.bankName}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(bankConfig.bankName, 'bank')}
                    className="p-2 rounded-xl liquid-control text-zinc-600 dark:text-zinc-300 text-xs font-bold flex items-center gap-1"
                  >
                    {copiedField === 'bank' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'bank' ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>

                <div className="p-4 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">Número de Cuenta ({bankConfig.accountType})</span>
                    <span className="text-base font-mono font-extrabold text-blue-600 dark:text-blue-400">{bankConfig.accountNumber}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(bankConfig.accountNumber, 'acc')}
                    className="p-2 rounded-xl liquid-control text-zinc-600 dark:text-zinc-300 text-xs font-bold flex items-center gap-1"
                  >
                    {copiedField === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'acc' ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>

                <div className="p-4 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block">WhatsApp Oficial de Comprobantes</span>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">{bankConfig.whatsappProof}</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    Bot Activo
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Sincronización ERP Pontífico */}
        {activeTab === 'pontifico' && (
          <div className="liquid-glass rounded-[36px] p-7 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-500" />
                  Monitor de Descargue e Integración ERP Pontífico
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Descargue automático de inventarios por consumo ejecutado con firma criptográfica HMAC-SHA256.
                </p>
              </div>
            </div>

            <div className="p-5 bg-black/5 dark:bg-black/30 rounded-3xl border border-black/5 dark:border-white/10 font-mono text-xs text-zinc-800 dark:text-zinc-200 overflow-x-auto space-y-2">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold block">// Ejemplo Payload Webhook REST emitido a ERP Pontífico</span>
              <pre>
{`{
  "event": "MEAL_CONSUMED_DISPATCH",
  "timestamp": "${new Date().toISOString()}",
  "pos_station": "POS_COMEDOR_01",
  "student_id": "std_894_javier",
  "sku_dispensed": "PROD-ALM-EJECUTIVO",
  "deductions_applied": [
    { "raw_material_sku": "RAW-PROTEIN-CHICKEN", "quantity_deducted": 0.120, "unit": "KG" },
    { "raw_material_sku": "RAW-GRAIN-RICE", "quantity_deducted": 0.080, "unit": "KG" },
    { "raw_material_sku": "RAW-VEG-SALAD", "quantity_deducted": 0.100, "unit": "KG" }
  ]
}`}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 5: Bandeja de Tickets WhatsApp */}
        {activeTab === 'tickets' && (
          <div className="liquid-glass rounded-[36px] p-7 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10">
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-500" />
                  Bandeja de Atención Humana & Bot WhatsApp
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Tickets y carnets compartidos por los representantes familiares para canjes y consultas.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`p-5 rounded-3xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm ${
                    ticket.status === 'RESUELTO'
                      ? 'bg-emerald-500/5 border-emerald-500/20 opacity-75'
                      : 'bg-white/60 dark:bg-white/5 border-black/5 dark:border-white/10 hover:border-blue-500'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20">
                        {ticket.id}
                      </span>
                      <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white">{ticket.parentName}</h4>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">({ticket.studentName})</span>
                    </div>
                    <p className="text-xs text-zinc-700 dark:text-zinc-300">{ticket.reason}</p>
                    <div className="flex items-center gap-3 text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
                      <span>Tel: {ticket.phone}</span>
                      <span>•</span>
                      <span>{ticket.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {ticket.status === 'RESUELTO' ? (
                      <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5 border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        Resuelto
                      </span>
                    ) : (
                      <>
                        <a
                          href={`https://wa.me/${ticket.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-full liquid-active-green text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Abrir Chat WhatsApp</span>
                        </a>
                        <button
                          onClick={() => handleResolveTicket(ticket.id)}
                          className="px-3.5 py-2 rounded-full liquid-control text-zinc-700 dark:text-zinc-300 font-bold text-xs transition-all flex items-center gap-1"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Marcar Resuelto</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal para Crear Nuevo Plato / Receta BOM */}
      {showCreateMenuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/70 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-lg liquid-glass rounded-[36px] p-8 space-y-6 shadow-2xl border border-white/70 dark:border-white/20 relative">
            <button
              onClick={() => setShowCreateMenuModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full liquid-control text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                <Utensils className="w-6 h-6 text-blue-500" />
                <span>Crear Plato & Ficha Técnica BOM</span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Registra un nuevo producto para el menú con su fórmula de descargue de insumos en ERP Pontífico.
              </p>
            </div>

            <form onSubmit={handleCreateMenuSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400">Código SKU Pontífico</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: PROD-ALM-DIETA"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value.toUpperCase())}
                    className="w-full px-4 py-2.5 bg-white/80 dark:bg-zinc-900/80 border border-zinc-300 dark:border-zinc-700 rounded-2xl text-sm font-mono text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400">Precio Venta ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(parseFloat(e.target.value))}
                    className="w-full px-4 py-2.5 bg-white/80 dark:bg-zinc-900/80 border border-zinc-300 dark:border-zinc-700 rounded-2xl text-sm font-mono text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400">Nombre del Plato / Producto</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Menú Dieta Liviana (Pechuga + Verduras)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/80 dark:bg-zinc-900/80 border border-zinc-300 dark:border-zinc-700 rounded-2xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400">Tipo de Producto</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-white/80 dark:bg-zinc-900/80 border border-zinc-300 dark:border-zinc-700 rounded-2xl text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="PRODUCIDO">Plato Producido en Cocina (Requiere Ficha BOM)</option>
                  <option value="SIMPLE">Insumo Simple / Producto Directo</option>
                </select>
              </div>

              {newType === 'PRODUCIDO' && (
                <div className="p-4 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl space-y-3">
                  <span className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400 block">
                    Fórmula de Ingredientes (BOM)
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">Proteína:</span>
                      <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">120g Pollo</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">Carbohidrato:</span>
                      <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">80g Arroz</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">Vegetales:</span>
                      <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">100g Ensalada</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateMenuModal(false)}
                  className="flex-1 py-3 liquid-control text-zinc-700 dark:text-zinc-300 font-bold rounded-full text-xs uppercase tracking-wider"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingMenu}
                  className="flex-1 py-3 liquid-active-blue text-white font-bold rounded-full text-xs uppercase tracking-wider shadow-lg"
                >
                  {savingMenu ? 'Guardando...' : 'Crear Plato'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Editar Cuentas Bancarias y QR */}
      {showEditBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/70 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-lg liquid-glass rounded-[36px] p-8 space-y-5 shadow-2xl border border-white/70 dark:border-white/20 relative">
            <button
              onClick={() => setShowEditBankModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full liquid-control text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-2xl font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                <Building className="w-6 h-6 text-blue-500" />
                <span>Configurar Cuentas Bancarias & QR</span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Actualiza los datos para transferencias bancarias directas y WhatsApp oficial de validación.
              </p>
            </div>

            <form onSubmit={handleSaveBankConfig} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400">Institución Financiera</label>
                  <input
                    type="text"
                    required
                    value={editBankName}
                    onChange={(e) => setEditBankName(e.target.value)}
                    className="w-full px-4 py-2 bg-white/80 dark:bg-zinc-900/80 border border-zinc-300 dark:border-zinc-700 rounded-2xl text-xs font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400">Tipo de Cuenta</label>
                  <input
                    type="text"
                    required
                    value={editAccountType}
                    onChange={(e) => setEditAccountType(e.target.value)}
                    className="w-full px-4 py-2 bg-white/80 dark:bg-zinc-900/80 border border-zinc-300 dark:border-zinc-700 rounded-2xl text-xs font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400">Número de Cuenta</label>
                  <input
                    type="text"
                    required
                    value={editAccountNumber}
                    onChange={(e) => setEditAccountNumber(e.target.value)}
                    className="w-full px-4 py-2 bg-white/80 dark:bg-zinc-900/80 border border-zinc-300 dark:border-zinc-700 rounded-2xl text-xs font-mono font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400">RUC Beneficiario</label>
                  <input
                    type="text"
                    required
                    value={editRuc}
                    onChange={(e) => setEditRuc(e.target.value)}
                    className="w-full px-4 py-2 bg-white/80 dark:bg-zinc-900/80 border border-zinc-300 dark:border-zinc-700 rounded-2xl text-xs font-mono font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400">Nombre del Beneficiario</label>
                <input
                  type="text"
                  required
                  value={editHolderName}
                  onChange={(e) => setEditHolderName(e.target.value)}
                  className="w-full px-4 py-2 bg-white/80 dark:bg-zinc-900/80 border border-zinc-300 dark:border-zinc-700 rounded-2xl text-xs font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400">WhatsApp Oficial para Notificaciones</label>
                <input
                  type="text"
                  required
                  value={editWhatsapp}
                  onChange={(e) => setEditWhatsapp(e.target.value)}
                  className="w-full px-4 py-2 bg-white/80 dark:bg-zinc-900/80 border border-zinc-300 dark:border-zinc-700 rounded-2xl text-xs font-mono font-bold text-zinc-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditBankModal(false)}
                  className="flex-1 py-3 liquid-control text-zinc-700 dark:text-zinc-300 font-bold rounded-full text-xs uppercase tracking-wider"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 liquid-active-blue text-white font-bold rounded-full text-xs uppercase tracking-wider shadow-lg"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
