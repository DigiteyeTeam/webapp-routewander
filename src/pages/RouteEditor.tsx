import { useMemo, useState } from 'react';
import { ArrowLeft, Save, MapPin, Plus, Trash2, GripVertical, ImageIcon, Clock, Play } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { HOTEL_LIBRARY_PATH } from '../config/navigation';
import { getRouteById } from '../data/routeStore';
import { MotionPage, MotionHeader, MotionSection, MotionList, MotionListItem, MotionCard } from '../components/motion/PortalMotion';
import {
  getLibraryEntry,
  getLibraryDisplayDescription,
  getLibraryDisplayTitle,
  resolveLibrarySourceRoute,
} from '../data/libraryRoutes';

interface Point {
  id: string;
  title: string;
  description: string;
  timeEstimate: string;
}

function waypointsToPoints(routeId: string, limit?: number): Point[] {
  const detail = getRouteById(routeId);
  if (!detail) return [];
  const wps = limit ? detail.waypoints.slice(0, limit) : detail.waypoints;
  return wps.map((wp, i) => ({
    id: wp.id,
    title: wp.name,
    description: wp.description ?? '',
    timeEstimate: i === 0 ? '45 นาที' : '30 นาที',
  }));
}

export default function RouteEditor() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const entry = id ? getLibraryEntry(id) : undefined;
  const source = entry ? resolveLibrarySourceRoute(entry) : undefined;

  const initial = useMemo(() => {
    if (!entry || !source) {
      return {
        routeName: 'เส้นทางไม่พบ',
        routeDescription: '',
        points: [] as Point[],
        previewRouteId: null as string | null,
      };
    }
    const isCustomFork = entry.license === 'custom';
    return {
      routeName: getLibraryDisplayTitle(entry, source),
      routeDescription: getLibraryDisplayDescription(entry, source),
      points: waypointsToPoints(source.id, isCustomFork ? 3 : undefined),
      previewRouteId: source.id,
    };
  }, [entry, source]);

  const [routeName, setRouteName] = useState(initial.routeName);
  const [routeDescription, setRouteDescription] = useState(initial.routeDescription);
  const [points, setPoints] = useState<Point[]>(initial.points);

  const addPoint = () => {
    const newPoint: Point = {
      id: Math.random().toString(36).slice(2, 11),
      title: 'จุดแวะใหม่',
      description: 'เพิ่มรายละเอียดที่นี่...',
      timeEstimate: '30 นาที',
    };
    setPoints([...points, newPoint]);
  };

  const removePoint = (pointId: string) => {
    setPoints(points.filter((p) => p.id !== pointId));
  };

  const updatePoint = (pointId: string, field: keyof Point, value: string) => {
    setPoints(points.map((p) => (p.id === pointId ? { ...p, [field]: value } : p)));
  };

  if (!entry || !source) {
    return (
    <MotionPage className="max-w-7xl mx-auto text-center py-24">
        <h1 className="font-headline-lg text-2xl font-bold text-on-surface mb-4">ไม่พบเส้นทางในคลัง</h1>
        <Link to={HOTEL_LIBRARY_PATH} className="text-primary font-bold hover:underline">
          กลับไปคลังของฉัน
        </Link>
      </MotionPage>
    );
  }

  return (
    <MotionPage className="max-w-7xl mx-auto space-y-8">
      <MotionHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to={HOTEL_LIBRARY_PATH} className="p-2 hover:bg-surface-variant rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-on-surface" />
          </Link>
          <div>
            <h1 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface">แก้ไขเส้นทาง</h1>
            <p className="text-secondary text-sm">
              ปรับแต่งเวอร์ชันของคุณ · ต้นฉบับโดย {source.creator.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {initial.previewRouteId && (
            <Link
              to={`/route/${initial.previewRouteId}`}
              className="px-6 py-2 rounded-xl font-bold text-primary hover:bg-primary/10 transition-colors flex items-center gap-2"
            >
              <Play className="w-5 h-5" /> ดูตัวอย่าง
            </Link>
          )}
          <button
            type="button"
            onClick={() => navigate(HOTEL_LIBRARY_PATH)}
            className="px-6 py-2 rounded-xl font-bold bg-primary text-on-primary hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-soft"
          >
            <Save className="w-5 h-5" /> บันทึกการเปลี่ยนแปลง
          </button>
        </div>
      </MotionHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <MotionSection className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant shadow-soft">
            <h2 className="font-headline-md text-xl font-bold text-on-surface mb-6">ข้อมูลทั่วไป</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">ชื่อเวอร์ชัน</label>
                <input
                  type="text"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">คำอธิบายที่ปรับแต่ง</label>
                <textarea
                  value={routeDescription}
                  onChange={(e) => setRouteDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                />
              </div>
            </div>
          </MotionSection>

          <MotionSection className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant shadow-soft">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline-md text-xl font-bold text-on-surface">จุดแวะในเส้นทาง</h2>
              <button
                type="button"
                onClick={addPoint}
                className="text-sm font-bold text-primary flex items-center gap-1 hover:underline"
              >
                <Plus className="w-4 h-4" /> เพิ่มจุด
              </button>
            </div>

            <div className="space-y-4">
              {points.map((point, index) => (
                <div
                  key={point.id}
                  className="group bg-surface-container flex gap-4 p-4 rounded-xl border border-transparent hover:border-outline-variant transition-all relative"
                >
                  <div className="flex flex-col items-center gap-2 mt-2">
                    <button
                      type="button"
                      className="text-on-surface-variant hover:text-on-surface cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical className="w-5 h-5" />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                      {index + 1}
                    </div>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-start">
                      <input
                        type="text"
                        value={point.title}
                        onChange={(e) => updatePoint(point.id, 'title', e.target.value)}
                        className="font-bold text-lg text-on-surface bg-transparent border-none p-0 focus:ring-0 w-full"
                      />
                      <button
                        type="button"
                        onClick={() => removePoint(point.id)}
                        className="text-error opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-error/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <textarea
                      value={point.description}
                      onChange={(e) => updatePoint(point.id, 'description', e.target.value)}
                      rows={2}
                      className="w-full text-sm text-secondary bg-transparent border border-transparent hover:border-outline-variant focus:border-outline-variant rounded p-2 focus:outline-none resize-none transition-colors"
                    />

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-xs text-secondary bg-surface-container-high px-3 py-1.5 rounded-lg border border-outline-variant">
                        <Clock className="w-4 h-4 text-primary" />
                        <input
                          type="text"
                          value={point.timeEstimate}
                          onChange={(e) => updatePoint(point.id, 'timeEstimate', e.target.value)}
                          className="bg-transparent border-none p-0 focus:ring-0 w-20 text-xs text-secondary"
                        />
                      </div>
                      <button
                        type="button"
                        className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
                      >
                        <ImageIcon className="w-4 h-4" /> เพิ่มรูปภาพ
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addPoint}
              className="mt-6 w-full py-4 rounded-xl border-2 border-dashed border-outline-variant text-secondary font-bold hover:bg-surface-container-low hover:border-primary/30 hover:text-primary transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" /> เพิ่มจุดแวะใหม่
            </button>
          </MotionSection>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-soft sticky top-6">
            <div className="h-40 relative">
              <img src={source.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-3 left-4 right-4 text-white text-sm font-bold line-clamp-2">
                {source.title}
              </p>
            </div>
            <div className="p-4 space-y-2 text-sm text-secondary">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                {source.district} · {source.stops} จุด · {source.duration}
              </p>
              <p className="text-xs leading-relaxed">{source.description}</p>
            </div>
          </div>
        </div>
      </div>
    </MotionPage>
  );
}
