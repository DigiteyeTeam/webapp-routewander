import { Link } from 'react-router-dom';
import { Building2, ChevronDown, CreditCard, Download, Receipt, ShoppingBag } from 'lucide-react';
import { MotionPage, MotionHeader, MotionSection, MotionList, MotionListItem, MotionCard } from '../components/motion/PortalMotion';
import {
  MOCK_TRAVELER_PROFILE,
  getTravelerPaymentSummary,
  getTravelerPurchases,
} from '../data/travelerProfile';

export default function TravelerPurchases() {
  const profile = MOCK_TRAVELER_PROFILE;
  const summary = getTravelerPaymentSummary();
  const purchases = getTravelerPurchases();

  return (
    <MotionPage className="p-6 md:p-12 lg:p-16 w-full max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-display-lg text-4xl md:text-5xl font-bold text-on-surface tracking-tight mb-4">
            การจ่ายเงิน & รายการที่ซื้อ
          </h1>
          <p className="font-body-lg text-xl text-on-surface-variant max-w-2xl opacity-80">
            ประวัติการซื้อเส้นทางและการชำระเงินของ {profile.name}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 h-14 px-6 border-2 border-surface-variant text-on-surface rounded-full font-bold hover:bg-surface-variant transition-colors"
        >
          <Download className="w-5 h-5" />
          ส่งออกใบเสร็จ
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-blue-600 text-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgba(37,99,235,0.35)] relative overflow-hidden flex flex-col justify-between min-h-[280px]">
          <div className="absolute -right-12 -top-12 opacity-10 pointer-events-none">
            <CreditCard className="w-64 h-64" />
          </div>
          <div>
            <h3 className="font-bold text-lg opacity-90 uppercase tracking-wider mb-2">ยอดใช้จ่ายทั้งหมด</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-bold opacity-80">฿</span>
              <span className="font-display-lg text-6xl md:text-7xl font-extrabold tracking-tighter">
                {summary.totalSpent.toLocaleString('th-TH')}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-8">
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
              <ShoppingBag className="w-5 h-5" />
              <span className="font-bold">{summary.routesPurchased} เส้นทางที่ซื้อ</span>
            </div>
            {summary.savedViaHotel > 0 && (
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Building2 className="w-5 h-5" />
                <span className="font-bold">ประหยัด {summary.savedViaHotelFormatted} ผ่านโรงแรม</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-3xl p-8 border border-surface-variant shadow-[0px_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[280px]">
          <div>
            <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mb-6">
              <Receipt className="w-7 h-7" />
            </div>
            <h3 className="font-headline-md text-2xl font-bold text-on-surface mb-2">วิธีชำระเงินหลัก</h3>
            <p className="text-secondary text-lg">บัตรเครดิต ·••• 4242</p>
          </div>
          <div className="mt-8 pt-8 border-t border-surface-variant">
            <p className="font-bold text-sm text-secondary uppercase tracking-wider mb-2">ใบเสร็จล่าสุด</p>
            <p className="font-bold text-on-surface">{purchases[0]?.routeTitle ?? '—'}</p>
            <p className="text-sm text-secondary">{purchases[0]?.date ?? '—'} · {purchases[0]?.amountFormatted ?? '—'}</p>
          </div>
        </div>
      </div>

      <MotionSection className="space-y-5">
        <h2 className="text-2xl font-bold text-on-surface">เส้นทางที่ซื้อแล้ว</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {purchases.map((p) => (
            <Link
              key={p.id}
              to={`/route/${p.routeId}`}
              className="flex flex-col p-5 rounded-2xl border border-surface-variant bg-surface-container-lowest hover:border-blue-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-bold text-on-surface group-hover:text-blue-700 transition-colors">{p.routeTitle}</p>
                  <p className="text-xs text-secondary mt-1">{p.date} · {p.guestCount} คน</p>
                </div>
                <span className="text-lg font-extrabold text-blue-700">{p.amountFormatted}</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-bold">{p.paymentMethod}</span>
                {p.hotelName && (
                  <span className="px-2 py-1 rounded-full bg-orange-50 text-orange-800 font-medium flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {p.hotelName}
                  </span>
                )}
                <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">ชำระแล้ว</span>
              </div>
            </Link>
          ))}
        </div>
      </MotionSection>

      <div className="bg-surface-container-lowest rounded-3xl border border-surface-variant shadow-[0px_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-6 md:p-8 border-b border-surface-variant flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-headline-md text-2xl font-bold text-on-surface">ประวัติการชำระเงิน</h2>
          <button
            type="button"
            className="flex items-center gap-2 font-bold text-secondary hover:text-on-surface transition-colors px-4 py-2 bg-surface-container-low rounded-lg"
          >
            30 วันล่าสุด <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="p-4 md:p-6 font-bold text-secondary text-sm uppercase tracking-wider">วันที่</th>
                <th className="p-4 md:p-6 font-bold text-secondary text-sm uppercase tracking-wider">รายการ</th>
                <th className="p-4 md:p-6 font-bold text-secondary text-sm uppercase tracking-wider">ช่องทาง</th>
                <th className="p-4 md:p-6 font-bold text-secondary text-sm uppercase tracking-wider text-right">จำนวน</th>
                <th className="p-4 md:p-6 font-bold text-secondary text-sm uppercase tracking-wider text-right">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant">
              {purchases.map((p) => (
                <tr key={p.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="p-4 md:p-6 text-on-surface-variant whitespace-nowrap">{p.date}</td>
                  <td className="p-4 md:p-6 font-medium text-on-surface">{p.routeTitle}</td>
                  <td className="p-4 md:p-6 text-on-surface-variant text-sm">{p.paymentMethod}</td>
                  <td className="p-4 md:p-6 font-bold text-right text-blue-700">{p.amountFormatted}</td>
                  <td className="p-4 md:p-6 text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                      ชำระแล้ว
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MotionPage>
  );
}
