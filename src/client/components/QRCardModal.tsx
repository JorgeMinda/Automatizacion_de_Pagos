import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { X, RefreshCw, ShieldCheck } from 'lucide-react';

interface QRCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    gradeSection: string;
    staticCode: string;
    qrSeed: string;
  };
}

export const QRCardModal: React.FC<QRCardModalProps> = ({ isOpen, onClose, student }) => {
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  // Generación de payload seguro con timestamp para QR dinámico
  const dynamicQrPayload = `${student.qrSeed}_${Math.floor(Date.now() / 30000)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-[#0a0512] border border-violet-500/40 rounded-3xl p-6 shadow-2xl shadow-violet-600/20 text-center">
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full bg-white/5 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado Carnet */}
        <div className="flex items-center justify-center gap-2 text-violet-400 text-xs font-mono tracking-widest uppercase mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Carnet Digital Oficial
        </div>
        <h3 className="text-xl font-bold text-white">
          {student.firstName} {student.lastName}
        </h3>
        <p className="text-xs text-zinc-400 font-mono mt-0.5">{student.gradeSection}</p>

        {/* Contenedor QR con Borde Luminoso */}
        <div className="my-6 p-4 bg-white rounded-2xl inline-block shadow-lg shadow-violet-500/10">
          <QRCode
            value={dynamicQrPayload}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* Código Alternativo y Timer */}
        <div className="space-y-3">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest block">Código Estático Manual</span>
            <span className="font-mono text-xl font-bold tracking-widest text-violet-300">
              {student.staticCode}
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-zinc-400 font-mono">
            <RefreshCw className={`w-3.5 h-3.5 text-pink-400 ${countdown <= 5 ? 'animate-spin' : ''}`} />
            Actualización de seguridad en <span className="text-pink-400 font-bold">{countdown}s</span>
          </div>
        </div>
      </div>
    </div>
  );
};
