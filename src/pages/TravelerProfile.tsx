import type { SVGProps } from 'react';
import { Camera, Lock, Mail, Save, ShieldCheck } from 'lucide-react';
import ProfileAvatar from '../components/ProfileAvatar';
import { MotionPage, MotionHeader, MotionSection, MotionList, MotionListItem, MotionCard } from '../components/motion/PortalMotion';
import { MOCK_TRAVELER_PROFILE } from '../data/travelerProfile';

function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function TravelerProfile() {
  const profile = MOCK_TRAVELER_PROFILE;

  return (
    <MotionPage className="p-6 md:p-12 lg:p-16 w-full max-w-7xl mx-auto space-y-12">
      <MotionHeader className="mb-10">
        <h2 className="font-display-lg text-4xl md:text-5xl font-bold text-on-surface mb-2 tracking-tight">โปรไฟล์นักท่องเที่ยว</h2>
        <p className="font-body-lg text-xl text-secondary">จัดการข้อมูลส่วนตัว การชำระเงิน และการแจ้งเตือน</p>
      </MotionHeader>

      <MotionSection className="bg-surface-container-lowest p-6 md:p-10 rounded-3xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row gap-10 items-start border border-outline-variant/30">
        <div className="relative shrink-0 mx-auto lg:mx-0">
          <ProfileAvatar src={profile.avatar} alt={profile.name} tone="traveler" size="lg" />
          <button type="button" className="absolute bottom-2 right-2 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all">
            <Camera className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 w-full space-y-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h3 className="font-headline-md text-3xl font-bold text-on-surface">{profile.name}</h3>
                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="font-bold text-xs uppercase tracking-wider">Lv.{profile.level} · {profile.xp} XP</span>
                </div>
              </div>
              <p className="font-body-md text-lg text-secondary">{profile.tagline}</p>
            </div>
            <button type="button" className="shrink-0 px-6 h-12 border-2 border-surface-variant text-on-surface font-bold rounded-xl hover:bg-surface-variant transition-colors">
              แก้ไขโปรไฟล์
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-surface-variant">
            <div className="space-y-2">
              <label className="block font-bold text-sm text-secondary uppercase tracking-wider">ชื่อที่แสดง</label>
              <input
                type="text"
                defaultValue={profile.name}
                className="w-full h-14 px-4 rounded-xl border border-surface-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="block font-bold text-sm text-secondary uppercase tracking-wider">อีเมล</label>
              <input
                type="email"
                defaultValue="mint.traveler@email.com"
                className="w-full h-14 px-4 rounded-xl border border-surface-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all font-medium"
              />
            </div>
          </div>
        </div>
      </MotionSection>

      <MotionSection className="bg-surface-container-lowest p-6 md:p-10 rounded-3xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-outline-variant/30">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
          </div>
          <h3 className="font-headline-md text-2xl font-bold text-on-surface">วิธีชำระเงิน</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block font-bold text-sm text-secondary uppercase tracking-wider">บัตรหลัก</label>
            <div className="relative">
              <select className="w-full h-14 px-4 pr-12 rounded-xl border border-surface-variant bg-surface text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all cursor-pointer font-medium">
                <option>Visa ·••• 4242 (หมดอายุ 12/28)</option>
                <option>PromptPay · 08x-xxx-xx89</option>
              </select>
              <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary pointer-events-none w-5 h-5" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block font-bold text-sm text-secondary uppercase tracking-wider">ภาษี / ใบเสร็จ</label>
            <input
              type="text"
              defaultValue="ไม่ระบุเลขผู้เสียภาษี"
              className="w-full h-14 px-4 rounded-xl border border-surface-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all font-medium"
            />
          </div>
        </div>
      </MotionSection>

      <MotionSection className="bg-surface-container-lowest p-6 md:p-10 rounded-3xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-outline-variant/30">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-headline-md text-2xl font-bold text-on-surface">ความปลอดภัยและการแจ้งเตือน</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-6 rounded-2xl border border-surface-variant bg-surface hover:border-blue-300 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-bold text-lg text-on-surface mb-1">แจ้งเตือนทางอีเมล</span>
                <span className="text-sm text-secondary font-medium">รับสรุปทริปและใบเสร็จหลังซื้อเส้นทาง</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-14 h-8 bg-surface-variant peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-200 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>

          <div className="flex items-center justify-between p-6 rounded-2xl border border-surface-variant bg-surface hover:border-blue-300 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-bold text-lg text-on-surface mb-1">ยืนยันตัวตนสองขั้นตอน</span>
                <span className="text-sm text-secondary font-medium">เพิ่มความปลอดภัยให้บัญชีนักท่องเที่ยว</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-14 h-8 bg-surface-variant peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-200 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>
        </div>
      </MotionSection>

      <div className="flex justify-end pb-12">
        <button type="button" className="w-full md:w-auto px-10 h-16 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all flex items-center justify-center gap-2 text-lg">
          <Save className="w-6 h-6" />
          บันทึกการเปลี่ยนแปลง
        </button>
      </div>
    </MotionPage>
  );
}
