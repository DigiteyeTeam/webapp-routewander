import React from 'react';
import { Camera, Verified, Lock, Mail, Key, Save } from 'lucide-react';
import { PROFILE_AVATAR } from '../data/profileAvatar';

export default function Profile() {
  return (
    <div className="p-6 md:p-12 lg:p-16 w-full max-w-7xl mx-auto space-y-12">
      <header className="mb-10">
        <h2 className="font-display-lg text-4xl md:text-5xl font-bold text-on-surface mb-2 tracking-tight">โปรไฟล์และตั้งค่า</h2>
        <p className="font-body-lg text-xl text-secondary">จัดการข้อมูลครีเอเตอร์และบัญชีรับเงิน</p>
      </header>

      <div className="space-y-8">
        <section className="bg-surface-container-lowest p-6 md:p-10 rounded-3xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)] flex flex-col lg:flex-row gap-10 items-start border border-outline-variant/30">
          <div className="relative shrink-0 mx-auto lg:mx-0">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-surface-container-lowest shadow-md">
              <img src={PROFILE_AVATAR} 
                    alt="รูปโปรไฟล์" 
                    className="w-full h-full object-cover" />
            </div>
            <button className="absolute bottom-2 right-2 w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-primary-container">
              <Camera className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 w-full space-y-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="font-headline-md text-3xl font-bold text-on-surface">สมชาย ใจดี</h3>
                  <div className="bg-primary-container text-primary px-3 py-1 rounded-full flex items-center gap-1">
                    <Verified className="w-4 h-4" />
                    <span className="font-bold text-xs uppercase tracking-wider">สมาชิกยืนยันแล้ว</span>
                  </div>
                </div>
                <p className="font-body-md text-lg text-secondary">ไกด์ท้องถิ่นภูเก็ต เน้นมรดกเปรานกัน</p>
              </div>
              <button className="shrink-0 px-6 h-12 border-2 border-surface-variant text-on-surface font-bold rounded-xl hover:bg-surface-variant transition-colors focus:outline-none focus:ring-4 focus:ring-primary-container">
                แก้ไขประวัติ
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-surface-variant">
              <div className="space-y-2">
                <label className="block font-bold text-sm text-secondary uppercase tracking-wider">ชื่อที่แสดง</label>
                <input type="text" defaultValue="สมชาย ใจดี" 
                        className="w-full h-14 px-4 rounded-xl border border-surface-variant bg-surface text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" />
              </div>
              <div className="space-y-2">
                <label className="block font-bold text-sm text-secondary uppercase tracking-wider">อีเมล</label>
                <input type="email" defaultValue="somchai@routewander.com" 
                        className="w-full h-14 px-4 rounded-xl border border-surface-variant bg-surface text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest p-6 md:p-10 rounded-3xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-outline-variant/30">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary-container text-primary flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
            </div>
            <h3 className="font-headline-md text-2xl font-bold text-on-surface">การรับเงินและบัญชีธนาคาร</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block font-bold text-sm text-secondary uppercase tracking-wider">ธนาคาร</label>
              <div className="relative">
                <select className="w-full h-14 px-4 pr-12 rounded-xl border border-surface-variant bg-surface text-body-md text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer font-medium">
                  <option>ธนาคารกสิกรไทย (KBANK)</option>
                  <option>ธนาคารไทยพาณิชย์ (SCB)</option>
                  <option>ธนาคารกรุงเทพ</option>
                </select>
                <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary pointer-events-none w-5 h-5" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block font-bold text-sm text-secondary uppercase tracking-wider">เลขบัญชี</label>
              <input type="text" defaultValue="123-4-56789-0" placeholder="XXX-X-XXXXX-X" 
                      className="w-full h-14 px-4 rounded-xl border border-surface-variant bg-surface text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" />
            </div>
            <div className="space-y-2 md:col-span-2 lg:col-span-1">
              <label className="block font-bold text-sm text-secondary uppercase tracking-wider">พร้อมเพย์ (เบอร์โทรหรือเลขบัตรประชาชน)</label>
              <div className="relative">
                <input type="text" defaultValue="081-234-5678" placeholder="08X-XXX-XXXX" 
                        className="w-full h-14 px-4 rounded-xl border border-surface-variant bg-surface text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" />
              </div>
              <p className="font-medium text-xs text-secondary mt-2">ใช้สำหรับการจ่ายเงินรายสัปดาห์ให้ครีเอเตอร์โดยอัตโนมัติ</p>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest p-6 md:p-10 rounded-3xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)] border border-outline-variant/30">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary-container text-primary flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-headline-md text-2xl font-bold text-on-surface">ความปลอดภัยและการแจ้งเตือน</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-6 rounded-2xl border border-surface-variant bg-surface hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-bold text-lg text-on-surface mb-1">แจ้งเตือนทางอีเมล</span>
                  <span className="text-sm text-secondary font-medium">รับสรุปรายสัปดาห์และแจ้งเตือนการจ่ายเงิน</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-14 h-8 bg-surface-variant peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-6 rounded-2xl border border-surface-variant bg-surface hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <div>
                  <span className="block font-bold text-lg text-on-surface mb-1">ยืนยันตัวตนสองขั้นตอน</span>
                  <span className="text-sm text-secondary font-medium">เพิ่มความปลอดภัยให้บัญชีของคุณ</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-14 h-8 bg-surface-variant peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="pt-4">
              <button className="flex items-center gap-2 text-on-surface border-2 border-surface-variant font-bold hover:bg-surface-variant px-6 h-12 rounded-xl transition-colors focus:outline-none focus:ring-4 focus:ring-primary-container">
                <Key className="w-4 h-4" />
                เปลี่ยนรหัสผ่าน
              </button>
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-6 pb-12">
          <button className="w-full md:w-auto px-10 h-16 bg-primary text-on-primary rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all flex items-center justify-center gap-2 text-lg focus:outline-none focus:ring-4 focus:ring-primary/30">
            <Save className="w-6 h-6" />
            บันทึกการเปลี่ยนแปลง
          </button>
        </div>
      </div>
    </div>
  );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}
