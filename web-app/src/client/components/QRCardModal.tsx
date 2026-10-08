import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, RefreshCw, ShieldCheck, MessageSquare, Check, Sparkles } from 'lucide-react';

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
  const [shared, setShared] = useState(false);

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

  // Obtener número de WhatsApp dinámico configurado por el Administrador
  const getDynamicWhatsAppNumber = () => {
    try {
      const saved = localStorage.getItem('luxlunch_bank_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.whatsappProof) {
          let clean = parsed.whatsappProof.replace(/[^0-9]/g, '');
          if (clean.startsWith('0')) {
            clean = '593' + clean.slice(1);
          } else if (!clean.startsWith('593') && clean.length === 9) {
            clean = '593' + clean;
          }
          return { raw: parsed.whatsappProof, digits: clean };
        }
      }
    } catch {}
    return { raw: '+593 99 876 5432', digits: '593998765432' };
  };

  const targetPhone = getDynamicWhatsAppNumber();
  const shareText = `*CARNET DIGITAL OFICIAL LUXLUNCH*\n👤 *Estudiante:* ${student.firstName} ${student.lastName}\n🏫 *Grado:* ${student.gradeSection}\n🔑 *Código Canje:* ${student.staticCode}\n📲 *Bot WhatsApp:* Validación de almuerzos y consulta de saldos.`;
  const whatsappUrl = `https://wa.me/${targetPhone.digits}?text=${encodeURIComponent(shareText)}`;

  const handleShareWhatsApp = () => {
    // Registrar el ticket en la cola compartida de WhatsApp Bot
    const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket = {
      id: `wa_${Date.now()}`,
      ticketNumber: ticketId,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      code: student.staticCode,
      grade: student.gradeSection,
      status: 'EN_COLA',
      reason: `Carnet Digital Compartido para Validación (${student.gradeSection})`,
      phone: targetPhone.raw,
      time: 'Justo ahora',
      timestamp: new Date().toISOString()
    };

    try {
      const existingStr = localStorage.getItem('luxlunch_whatsapp_tickets');
      let ticketsList = existingStr ? JSON.parse(existingStr) : [];
      ticketsList = [newTicket, ...ticketsList.filter((t: any) => t.code !== student.staticCode)];
      localStorage.setItem('luxlunch_whatsapp_tickets', JSON.stringify(ticketsList));
      window.dispatchEvent(new CustomEvent('luxlunch_whatsapp_updated', { detail: newTicket }));
    } catch {}

    window.open(whatsappUrl, '_blank');
    setShared(true);
    setTimeout(() => setShared(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/70 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-sm liquid-glass rounded-[36px] p-7 shadow-2xl border border-white/70 dark:border-white/20 text-center space-y-4">
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full liquid-control text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Encabezado Carnet */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>Carnet Digital Oficial</span>
          </div>
          <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            {student.firstName} {student.lastName}
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{student.gradeSection}</p>
        </div>

        {/* Contenedor QR con Borde Refractivo Apple */}
        <div className="my-3 p-4 bg-white rounded-3xl inline-block shadow-lg border border-black/5">
          <QRCodeSVG
            value={dynamicQrPayload}
            size={180}
            level="H"
            includeMargin={false}
          />
        </div>

        {/* Código Alternativo y Timer */}
        <div className="space-y-3">
          <div className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10">
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block font-bold">
              Código Estático Manual
            </span>
            <span className="font-mono text-xl font-black tracking-widest text-zinc-900 dark:text-zinc-100">
              {student.staticCode}
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            <RefreshCw className={`w-3.5 h-3.5 text-blue-500 ${countdown <= 5 ? 'animate-spin' : ''}`} />
            <span>Rotación dinámica en</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">{countdown}s</span>
          </div>

          {/* Botón de Compartir con Bot de WhatsApp */}
          <div className="space-y-1.5 pt-1">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="w-full py-3.5 px-4 liquid-active-green text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all transform active:scale-95"
            >
              {shared ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>¡Enviado a {targetPhone.raw}!</span>
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4" />
                  <span>Compartir con Bot WhatsApp</span>
                </>
              )}
            </button>
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 block">
              Destino: {targetPhone.raw}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
