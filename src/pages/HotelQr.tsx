import { useCallback, useMemo, useState, type FormEvent } from 'react';
import { AlertCircle, Check, Plus, QrCode, Trash2 } from 'lucide-react';
import HotelQrCard from '../components/hotel/HotelQrCard';
import { MotionPage, MotionHeader, MotionSection, MotionList, MotionListItem, MotionCard } from '../components/motion/PortalMotion';
import {
  MAX_HOTEL_BRANCHES,
  createHotelBranch,
  deleteHotelBranch,
  getHotelBranches,
  slugifyHotelInput,
  updateHotelBranch,
  type HotelBranch,
} from '../data/hotelBranches';

export default function HotelQr() {
  const [branches, setBranches] = useState<HotelBranch[]>(() => getHotelBranches());
  const [copyToast, setCopyToast] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newDistrict, setNewDistrict] = useState('');
  const [newIsHq, setNewIsHq] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const canAddMore = branches.length < MAX_HOTEL_BRANCHES;
  const hasMultipleBranches = branches.length > 1;

  const refreshBranches = useCallback(() => {
    setBranches(getHotelBranches());
  }, []);

  const showCopied = useCallback(() => {
    setCopyToast(true);
    window.setTimeout(() => setCopyToast(false), 2000);
  }, []);

  const handleAddBranch = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    try {
      createHotelBranch({
        name: newName,
        slug: newSlug || slugifyHotelInput(newName),
        district: newDistrict || undefined,
        isHeadquarters: hasMultipleBranches ? newIsHq : true,
      });
      setNewName('');
      setNewSlug('');
      setNewDistrict('');
      setNewIsHq(false);
      setShowAddForm(false);
      refreshBranches();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'ไม่สามารถสร้างโรงแรมได้');
    }
  };

  const handleSetHeadquarters = (id: string) => {
    updateHotelBranch(id, { isHeadquarters: true });
    refreshBranches();
  };

  const handleDeleteBranch = (id: string) => {
    if (!window.confirm('ลบโรงแรมสาขานี้และ QR ที่เกี่ยวข้อง?')) return;
    try {
      deleteHotelBranch(id);
      refreshBranches();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'ไม่สามารถลบได้');
    }
  };

  const sortedBranches = useMemo(
    () => [...branches].sort((a, b) => Number(b.isHeadquarters) - Number(a.isHeadquarters)),
    [branches],
  );

  return (
    <MotionPage className="w-full max-w-7xl mx-auto space-y-10">
      {copyToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-orange-600 text-white text-sm font-bold shadow-lg">
          <Check className="w-4 h-4" />
          คัดลอกแล้ว
        </div>
      )}

      <MotionHeader className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-3">
            <QrCode className="w-3.5 h-3.5" />
            Hotel QR
          </div>
          <h1 className="font-display-lg text-3xl md:text-4xl font-bold text-on-surface tracking-tight mb-2">
            QR Code โรงแรม
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl">
            สร้าง QR ให้แขกสแกนเข้าเว็บผ่านโรงแรมนั้น หรือพิมพ์ชื่อโรงแรมตามด้วย slug
            — ตอนซื้อเส้นทางจะแสดงชื่อโรงแรมนี้โดยอัตโนมัติ
          </p>
        </div>
        {canAddMore && (
          <button
            type="button"
            onClick={() => {
              setShowAddForm((v) => !v);
              setFormError(null);
            }}
            className="inline-flex items-center justify-center gap-2 h-14 px-6 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shrink-0"
          >
            <Plus className="w-5 h-5" />
            เพิ่มโรงแรม
          </button>
        )}
      </MotionHeader>

      <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-4 md:p-5 flex gap-3">
        <AlertCircle className="w-5 h-5 text-orange-700 shrink-0 mt-0.5" />
        <div className="text-sm text-on-surface-variant leading-relaxed">
          {hasMultipleBranches ? (
            <>
              บัญชีนี้มี <strong className="text-orange-800">{branches.length} โรงแรม</strong> (สูงสุด {MAX_HOTEL_BRANCHES} แห่ง)
              — กำหนด <strong className="text-orange-800">สาขาใหญ่</strong> สำหรับรหัสสำนักงานใหญ่
              แต่ละสาขามี QR และ slug แยกกัน
            </>
          ) : (
            <>
              บัญชีนี้มีโรงแรมเดียว — สร้าง QR ได้ 1 ชุด
              หากมีหลายสาขาให้กด &quot;เพิ่มโรงแรม&quot; (สูงสุด {MAX_HOTEL_BRANCHES} แห่ง) และกำหนดสาขาใหญ่
            </>
          )}
        </div>
      </div>

      {formError && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm font-medium">
          {formError}
        </div>
      )}

      {showAddForm && canAddMore && (
        <form onSubmit={handleAddBranch} className="rounded-2xl border border-orange-200 bg-surface-container-lowest p-5 md:p-6 space-y-5 shadow-sm">
          <h2 className="font-bold text-lg text-on-surface">เพิ่มโรงแรม / สาขาใหม่</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block font-bold text-sm text-secondary uppercase tracking-wider">ชื่อโรงแรม</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  if (!newSlug) setNewSlug(slugifyHotelInput(e.target.value));
                }}
                placeholder="เช่น โรงแรมภูเก็ตวิว ป่าตอง"
                className="w-full h-12 px-4 rounded-xl border border-surface-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block font-bold text-sm text-secondary uppercase tracking-wider">Slug (a-z, 0-9, -)</label>
              <input
                type="text"
                value={newSlug}
                onChange={(e) => setNewSlug(slugifyHotelInput(e.target.value))}
                placeholder="phuket-view-patong"
                className="w-full h-12 px-4 rounded-xl border border-surface-variant bg-surface font-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                required
              />
              <p className="text-xs text-secondary">แสดงเป็น: {newName || 'ชื่อโรงแรม'} {newSlug || 'slug'}</p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="block font-bold text-sm text-secondary uppercase tracking-wider">พื้นที่ / สาขา (ไม่บังคับ)</label>
              <input
                type="text"
                value={newDistrict}
                onChange={(e) => setNewDistrict(e.target.value)}
                placeholder="ป่าตอง · ภูเก็ต"
                className="w-full h-12 px-4 rounded-xl border border-surface-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
              />
            </div>
          </div>
          {hasMultipleBranches && (
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={newIsHq}
                onChange={(e) => setNewIsHq(e.target.checked)}
                className="w-5 h-5 rounded border-surface-variant text-orange-500 focus:ring-orange-300"
              />
              <span className="text-sm font-medium text-on-surface">กำหนดเป็นสาขาใหญ่ (รหัสสำนักงานใหญ่)</span>
            </label>
          )}
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="h-11 px-6 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors">
              สร้างโรงแรมและ QR
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="h-11 px-6 border border-surface-variant font-bold rounded-xl hover:bg-surface-container-low transition-colors"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {sortedBranches.map((branch) => (
          <div key={branch.id} className="space-y-3">
            <HotelQrCard branch={branch} onCopy={showCopied} />
            {hasMultipleBranches && (
              <div className="flex flex-wrap gap-2 px-1">
                {!branch.isHeadquarters && (
                  <button
                    type="button"
                    onClick={() => handleSetHeadquarters(branch.id)}
                    className="text-xs font-bold text-orange-700 hover:underline"
                  >
                    ตั้งเป็นสาขาใหญ่
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteBranch(branch.id)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:underline ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  ลบสาขานี้
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-secondary text-center pb-4">
        ใช้ไปแล้ว {branches.length}/{MAX_HOTEL_BRANCHES} โรงแรม
      </p>
    </MotionPage>
  );
}
