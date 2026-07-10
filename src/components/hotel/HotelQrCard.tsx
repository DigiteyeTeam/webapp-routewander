import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Building2, Copy, Download, Printer, Star } from 'lucide-react';
import {
  type HotelBranch,
  buildHotelReferralUrl,
  formatHotelReferralLabel,
} from '../../data/hotelBranches';

interface HotelQrCardProps {
  branch: HotelBranch;
  onCopy?: () => void;
}

export default function HotelQrCard({ branch, onCopy }: HotelQrCardProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const referralUrl = buildHotelReferralUrl(branch.slug);
  const displayLabel = formatHotelReferralLabel(branch);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      onCopy?.();
    } catch {
      /* ignore */
    }
  };

  const handlePrint = () => {
    const node = printRef.current;
    if (!node) return;
    const win = window.open('', '_blank', 'width=480,height=640');
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html><head><title>QR ${branch.name}</title>
      <style>
        body { font-family: system-ui, sans-serif; text-align: center; padding: 32px; }
        h1 { font-size: 20px; margin: 0 0 8px; }
        p { color: #666; margin: 0 0 16px; font-size: 14px; }
        .slug { font-family: monospace; font-size: 13px; color: #c2410c; }
        svg { margin: 16px auto; display: block; }
      </style></head><body>
      ${node.innerHTML}
      <script>window.onload = () => { window.print(); window.close(); }</script>
      </body></html>
    `);
    win.document.close();
  };

  const handleDownload = () => {
    const svg = printRef.current?.querySelector('svg');
    if (!svg) return;
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-${branch.slug}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-orange-200 bg-surface-container-lowest overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-orange-100 bg-orange-50/60 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h4 className="font-bold text-on-surface text-lg truncate">{branch.name}</h4>
            {branch.isHeadquarters && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider shrink-0">
                <Star className="w-3 h-3 fill-white" />
                สาขาใหญ่
              </span>
            )}
          </div>
          <p className="text-sm text-secondary font-mono">{displayLabel}</p>
          {branch.district && <p className="text-xs text-secondary mt-1">{branch.district}</p>}
        </div>
        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center shrink-0">
          <Building2 className="w-5 h-5" />
        </div>
      </div>

      <div className="p-5 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        <div ref={printRef} className="shrink-0 bg-white p-4 rounded-xl border border-surface-variant shadow-inner text-center">
          <QRCodeSVG value={referralUrl} size={168} level="M" includeMargin />
          <p className="mt-3 font-bold text-sm text-on-surface">{branch.name}</p>
          <p className="slug text-xs text-orange-700 font-mono mt-1">{branch.slug}</p>
          <p className="text-[10px] text-secondary mt-2 max-w-[168px] leading-snug">
            สแกนเพื่อเข้าตลาดเส้นทางผ่านโรงแรมนี้
          </p>
        </div>

        <div className="flex-1 w-full space-y-4 min-w-0">
          <div>
            <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">ลิงก์สำหรับแขก</p>
            <p className="text-xs text-on-surface-variant break-all font-mono bg-surface-container-low rounded-lg px-3 py-2 border border-surface-variant">
              {referralUrl}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">ข้อความสำหรับพิมพ์</p>
            <p className="text-sm font-medium text-on-surface">{displayLabel}</p>
            <p className="text-xs text-secondary mt-1">
              แขกพิมพ์ชื่อโรงแรมตามด้วย slug หรือสแกน QR — ตอนซื้อเส้นทางจะแสดงชื่อโรงแรมนี้
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition-colors"
            >
              <Copy className="w-4 h-4" />
              คัดลอกลิงก์
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 h-10 rounded-xl border border-surface-variant text-on-surface text-sm font-bold hover:bg-surface-container-low transition-colors"
            >
              <Printer className="w-4 h-4" />
              พิมพ์ QR
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-4 h-10 rounded-xl border border-surface-variant text-on-surface text-sm font-bold hover:bg-surface-container-low transition-colors"
            >
              <Download className="w-4 h-4" />
              ดาวน์โหลด SVG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
