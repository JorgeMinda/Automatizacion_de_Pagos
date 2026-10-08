import React from 'react';
import { useQuery } from 'wasp/client/operations';
import { getAdminLedgerAudit } from 'wasp/client/operations';
import { Navbar } from '../components/Navbar';
import { AmbientGlow } from '../components/AmbientGlow';
import { GlassCard } from '../components/GlassCard';
import { FileSpreadsheet, ShieldCheck, ArrowDownLeft, ArrowUpRight, DollarSign, Database } from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const { data: ledgerEntries, isLoading, error } = useQuery(getAdminLedgerAudit);

  return (
    <div className="min-h-screen bg-[#05030a] text-zinc-100 relative selection:bg-[#f72585] selection:text-white pb-16">
      <AmbientGlow />
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Auditoría del Libro Diario (Double-Entry Ledger)
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Registro inmutable de asientos contables (Append-Only) y trazabilidad financiera.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-mono font-bold flex items-center gap-2">
              <Database className="w-4 h-4 text-violet-400" />
              Integridad Contable Cero-Descuadre
            </span>
          </div>
        </div>

        {/* Tabla de Asientos del Ledger */}
        <GlassCard className="p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-pink-400" />
              Últimos Asientos Contables Registrados
            </h3>
            <span className="text-xs text-zinc-500 font-mono">100 transacciones más recientes</span>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-zinc-500 font-mono text-sm">Cargando registros contables...</div>
          ) : error ? (
            <div className="p-4 bg-red-500/15 border border-red-500/40 rounded-xl text-red-300 text-sm">
              Error al consultar auditoría: {error.message}
            </div>
          ) : ledgerEntries && ledgerEntries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-400 uppercase font-mono tracking-wider">
                    <th className="py-3 px-4">Fecha & Hora</th>
                    <th className="py-3 px-4">Tipo</th>
                    <th className="py-3 px-4">Cuenta / Estudiante</th>
                    <th className="py-3 px-4">Descripción Asiento</th>
                    <th className="py-3 px-4 text-right">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {ledgerEntries.map((entry: any) => (
                    <tr key={entry.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 text-zinc-400">
                        {new Date(entry.createdAt).toLocaleString('es-EC')}
                      </td>
                      <td className="py-3.5 px-4">
                        {entry.type === 'DEBIT' ? (
                          <span className="inline-flex items-center gap-1 text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 font-bold">
                            <ArrowDownLeft className="w-3 h-3" /> DÉBITO
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                            <ArrowUpRight className="w-3 h-3" /> CRÉDITO
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-300 font-sans">
                        <span className="font-mono text-violet-400 font-bold block">
                          {entry.account.accountType}
                        </span>
                        {entry.account.student && (
                          <span className="text-xs text-zinc-400">
                            {entry.account.student.firstName} {entry.account.student.lastName}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-300 font-sans max-w-md">
                        {entry.description}
                      </td>
                      <td
                        className={`py-3.5 px-4 text-right font-bold text-sm ${
                          entry.type === 'DEBIT' ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        {entry.type === 'DEBIT' ? '-' : '+'}${Number(entry.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-zinc-500 text-sm">No existen registros contables aún.</div>
          )}
        </GlassCard>
      </main>
    </div>
  );
};
