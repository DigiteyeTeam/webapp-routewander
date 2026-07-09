import { TrendingUp, Download, Activity, ChevronDown } from 'lucide-react';
import { MotionPage, MotionHeader, MotionSection, MotionList, MotionListItem, MotionCard } from '../components/motion/PortalMotion';
import {
  MOCK_HOTEL_PROFILE,
  getHotelDashboardStats,
  getHotelFollowedRoutes,
  getHotelRecentBookings,
} from '../data/hotelProfile';

function toPayoutDate() {
  return 'ศุกร์ที่ 25 ต.ค.';
}

export default function HotelEarnings() {
  const profile = MOCK_HOTEL_PROFILE;
  const stats = getHotelDashboardStats();
  const topRoutes = getHotelFollowedRoutes().slice(0, 3);
  const withdrawableAmount = Math.round(stats.monthlyCommission * 0.8);
  const recent = getHotelRecentBookings().slice(0, 4);

  const transactions = [
    {
      date: recent[0]?.date ?? '18 ต.ค. 2569',
      desc: `คอมมิชชันจากการขาย: ${recent[0]?.routeTitle ?? topRoutes[0]?.title ?? 'มรดกเมืองเก่า'}`,
      type: 'คอมมิชชัน',
      amount: `+${recent[0]?.hotelCommissionFormatted ?? '฿225.00'}`,
      status: 'สำเร็จ',
      statusColor: 'bg-orange-100 text-orange-800',
      isIncome: true,
    },
    {
      date: recent[1]?.date ?? '17 ต.ค. 2569',
      desc: `คอมมิชชันจากการขาย: ${recent[1]?.routeTitle ?? topRoutes[1]?.title ?? 'สตรีทฟู้ด'}`,
      type: 'คอมมิชชัน',
      amount: `+${recent[1]?.hotelCommissionFormatted ?? '฿225.00'}`,
      status: 'สำเร็จ',
      statusColor: 'bg-orange-100 text-orange-800',
      isIncome: true,
    },
    {
      date: '15 ต.ค. 2569',
      desc: 'โอนเงินเข้า KBANK (รอบอัตโนมัติ)',
      type: 'ถอน',
      amount: `-฿${Math.round(withdrawableAmount * 0.7).toLocaleString('th-TH')}.00`,
      status: 'ดำเนินการแล้ว',
      statusColor: 'bg-blue-100 text-blue-800',
      isIncome: false,
    },
    {
      date: recent[2]?.date ?? '13 ต.ค. 2569',
      desc: `คอมมิชชันจากการขาย: ${recent[2]?.routeTitle ?? topRoutes[2]?.title ?? 'เส้นทางชุมชน'}`,
      type: 'คอมมิชชัน',
      amount: `+${recent[2]?.hotelCommissionFormatted ?? '฿180.00'}`,
      status: 'สำเร็จ',
      statusColor: 'bg-orange-100 text-orange-800',
      isIncome: true,
    },
  ];

  return (
    <MotionPage className="p-6 md:p-12 lg:p-16 w-full max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-display-lg text-4xl md:text-5xl font-bold text-on-surface tracking-tight mb-4">รายได้โรงแรม</h1>
          <p className="font-body-lg text-xl text-on-surface-variant max-w-2xl opacity-80">
            รายได้ของ {profile.name} จากคอมมิชชันการขายเส้นทาง และรายงานทางการเงิน
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 h-14 px-6 border-2 border-surface-variant text-on-surface rounded-full font-bold hover:bg-surface-variant transition-colors">
          <Download className="w-5 h-5" />
          ส่งออกรายงาน
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-orange-600 text-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgba(234,88,12,0.35)] relative overflow-hidden flex flex-col justify-between min-h-[320px]">
          <div className="absolute -right-12 -top-12 opacity-10 pointer-events-none">
            <svg width="300" height="300" viewBox="0 0 100 100" className="animate-pulse-slow">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" />
              <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="4" fill="none" />
            </svg>
          </div>

          <div>
            <h3 className="font-bold text-lg opacity-90 uppercase tracking-wider mb-2">
              ยอดที่ถอนได้ (ของ {profile.name})
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-bold opacity-80">฿</span>
              <span className="font-display-lg text-6xl md:text-8xl font-extrabold tracking-tighter">
                {withdrawableAmount.toLocaleString('th-TH')}
              </span>
              <span className="text-2xl md:text-3xl font-bold opacity-80">.00</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mt-8">
            <div className="flex items-center gap-3 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
              <TrendingUp className="w-5 h-5" />
              <span className="font-bold">+10.8% เทียบเดือนที่แล้ว</span>
            </div>
            <button className="w-full sm:w-auto h-14 px-8 bg-white text-orange-700 font-bold rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform text-lg whitespace-nowrap">
              ถอนเงิน
            </button>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-3xl p-8 border border-surface-variant shadow-[0px_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[320px]">
          <div>
            <div className="w-14 h-14 bg-orange-100 text-orange-700 rounded-2xl flex items-center justify-center mb-6">
              <Activity className="w-7 h-7" />
            </div>
            <h3 className="font-headline-md text-2xl font-bold text-on-surface mb-2">การจ่ายเงินอัตโนมัติครั้งถัดไป</h3>
            <p className="text-secondary text-lg">กำหนดวัน{toPayoutDate()}</p>
          </div>

          <div className="mt-8 pt-8 border-t border-surface-variant">
            <p className="font-bold text-sm text-secondary uppercase tracking-wider mb-2">บัญชีปลายทาง</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-surface-variant rounded flex items-center justify-center font-bold text-xs">ธนาคาร</div>
              <div>
                <p className="font-bold text-on-surface">ธนาคารกสิกรไทย (KBANK)</p>
                <p className="text-sm text-secondary">{profile.name} · เลขท้าย •••• 8841</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl border border-surface-variant shadow-[0px_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-6 md:p-8 border-b border-surface-variant flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-headline-md text-2xl font-bold text-on-surface">ธุรกรรมล่าสุด</h2>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 font-bold text-secondary hover:text-on-surface transition-colors px-4 py-2 bg-surface-container-low rounded-lg">
              30 วันล่าสุด <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="p-4 md:p-6 font-bold text-secondary text-sm uppercase tracking-wider">วันที่</th>
                <th className="p-4 md:p-6 font-bold text-secondary text-sm uppercase tracking-wider">รายละเอียด</th>
                <th className="p-4 md:p-6 font-bold text-secondary text-sm uppercase tracking-wider">ประเภท</th>
                <th className="p-4 md:p-6 font-bold text-secondary text-sm uppercase tracking-wider text-right">จำนวน</th>
                <th className="p-4 md:p-6 font-bold text-secondary text-sm uppercase tracking-wider text-right">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant">
              {transactions.map((tx, i) => (
                <tr key={i} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="p-4 md:p-6 text-on-surface-variant whitespace-nowrap">{tx.date}</td>
                  <td className="p-4 md:p-6 font-medium text-on-surface">{tx.desc}</td>
                  <td className="p-4 md:p-6 text-on-surface-variant">{tx.type}</td>
                  <td className={`p-4 md:p-6 font-bold text-right ${tx.isIncome ? 'text-orange-700' : 'text-on-surface'}`}>{tx.amount}</td>
                  <td className="p-4 md:p-6 text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${tx.statusColor}`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 text-center border-t border-surface-variant">
          <button className="text-orange-600 font-bold hover:underline">ดูธุรกรรมทั้งหมด</button>
        </div>
      </div>
    </MotionPage>
  );
}
