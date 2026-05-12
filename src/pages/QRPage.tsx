import { useState, useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Shield, Globe, MessageCircle, Mail, Download, Printer } from 'lucide-react';

const SITE_URL = 'https://business-services-three.vercel.app/';
const WHATSAPP_URL = 'https://wa.me/26772402849?text=Hello%20Prospero%2C%20I%27m%20interested%20in%20your%20business%20launch%20services.%20Please%20share%20more%20information.';
const EMAIL_URL = 'mailto:info@prosperokings.com?subject=Business%20Launch%20Inquiry';

type QRMode = 'whatsapp' | 'website' | 'email';

const modes: { key: QRMode; label: string; icon: typeof Globe; color: string; qrColor: string; desc: string }[] = [
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    icon: MessageCircle,
    color: '#25D366',
    qrColor: '#25D366',
    desc: 'Scan to chat with us on WhatsApp',
  },
  {
    key: 'website',
    label: 'Website',
    icon: Globe,
    color: '#C8963E',
    qrColor: '#C8963E',
    desc: 'Scan to visit our website',
  },
  {
    key: 'email',
    label: 'Email',
    icon: Mail,
    color: '#D4A853',
    qrColor: '#D4A853',
    desc: 'Scan to send us an email',
  },
];

export default function QRPage() {
  const [mode, setMode] = useState<QRMode>('whatsapp');
  const cardRef = useRef<HTMLDivElement>(null);

  const currentMode = modes.find((m) => m.key === mode)!;

  const getQrValue = useCallback(() => {
    switch (mode) {
      case 'whatsapp': return WHATSAPP_URL;
      case 'email': return EMAIL_URL;
      default: return SITE_URL;
    }
  }, [mode]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadSVG = () => {
    const svg = cardRef.current?.querySelector('svg');
    if (!svg) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prospero-qr-${mode}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-4 py-12 print:bg-white print:min-h-0">
      {/* Header */}
      <header className="mb-8 print:hidden">
        <a href="/" className="flex items-center gap-2 text-accent-gold font-display text-xl font-medium">
          <Shield className="w-6 h-6" />
          PROSPERO
        </a>
      </header>

      {/* Mode Selector - hidden when printing */}
      <div className="flex gap-2 mb-8 print:hidden">
        {modes.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-pill text-sm font-medium transition-all duration-200 ${
              mode === m.key
                ? 'text-white'
                : 'bg-bg-secondary text-text-muted hover:text-text-primary border border-[rgba(200,150,62,0.15)]'
            }`}
            style={mode === m.key ? { backgroundColor: m.color } : {}}
          >
            <m.icon className="w-4 h-4" />
            {m.label}
          </button>
        ))}
      </div>

      {/* QR Card - this is what prints */}
      <div
        ref={cardRef}
        className="bg-bg-secondary rounded-2xl p-10 md:p-14 text-center border border-[rgba(200,150,62,0.15)] max-w-md w-full print:bg-white print:border-2 print:border-gray-300 print:shadow-none print:p-8"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="w-8 h-8 print:text-black" style={{ color: currentMode.color }} />
          <span className="font-display text-2xl font-medium text-text-primary print:text-black">
            PROSPERO
          </span>
        </div>

        <p className="text-text-muted text-sm mb-8 print:text-gray-600 print:mb-6">
          {currentMode.desc}
        </p>

        {/* QR Code */}
        <div className="flex justify-center mb-8">
          <div className="p-4 bg-white rounded-xl print:p-2">
            <QRCodeSVG
              key={mode}
              value={getQrValue()}
              size={240}
              bgColor="#FFFFFF"
              fgColor={currentMode.qrColor}
              level="H"
              includeMargin={false}
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-1.5 text-sm print:text-gray-700">
          <p className="text-text-secondary print:text-gray-600">info@prosperokings.com</p>
          <p className="text-text-secondary print:text-gray-600">+267 72 402849 / +267 71 881185</p>
          <p className="text-text-muted text-xs print:text-gray-500">Gaborone, Botswana</p>
        </div>

        {/* Footer tagline */}
        <div className="mt-6 pt-5 border-t border-[rgba(200,150,62,0.15)] print:border-gray-200">
          <p className="text-text-muted text-xs print:text-gray-500">
            Launching Botswana&apos;s Entrepreneurs
          </p>
          <p className="text-text-muted text-[10px] mt-1 print:text-gray-400">
            Company Registration &middot; Branding &middot; Documentation &middot; Digital Presence
          </p>
        </div>
      </div>

      {/* Action Buttons - hidden when printing */}
      <div className="flex gap-3 mt-8 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-pill text-sm font-medium bg-accent-gold text-bg-primary hover:bg-accent-amber transition-all"
        >
          <Printer className="w-4 h-4" />
          Print
        </button>
        <button
          onClick={handleDownloadSVG}
          className="flex items-center gap-2 px-5 py-2.5 rounded-pill text-sm font-medium border border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-bg-primary transition-all"
        >
          <Download className="w-4 h-4" />
          Download SVG
        </button>
      </div>

      {/* Print Instructions - hidden when printing */}
      <div className="mt-8 text-center print:hidden max-w-sm">
        <p className="text-text-muted text-xs">
          Tip: For best print quality, use A4 paper or print on stickers.
          The QR code works at any size — from business cards to posters.
        </p>
      </div>

      {/* Print CSS */}
      <style>{`
        @media print {
          @page {
            margin: 1cm;
            size: auto;
          }
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
