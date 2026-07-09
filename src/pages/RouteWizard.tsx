import { Search, MapPin, Plus, Trash2, Car, Hotel, Utensils, Flag, ShoppingBag, CalendarDays, Users, X, ChevronUp, ChevronDown, Clock, Route as RouteIcon, Trees, Layers, Home, PenLine, ListOrdered, Save, Check, Landmark } from 'lucide-react';
import { useState, useEffect, useMemo, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, Popup, Circle, useMap, useMapEvents, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { motion, useReducedMotion } from 'motion/react';
import { fadeIn } from '../lib/motion';
import {
  ALL_POIS,
  COMMUNITY_POIS,
  POI_LAYER_META,
  type PhuketPoi,
  type PoiCategory,
} from '../data/phuketPois';

L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.9.4/dist/images/';

type WaypointType = 'meeting' | 'attraction' | 'hotel' | 'restaurant' | 'shop' | 'event' | 'activity' | 'end' | 'custom';

const WAYPOINT_TYPE_LABELS: Record<WaypointType, string> = {
  meeting: 'จุดนัดพบ',
  attraction: 'จุดท่องเที่ยว',
  hotel: 'โรงแรม',
  restaurant: 'ร้านอาหาร',
  shop: 'ร้านค้า',
  event: 'งานอีเว้นท์',
  activity: 'กิจกรรมชาวบ้าน',
  end: 'จุดสิ้นสุด',
  custom: 'อื่นๆ',
};

interface Waypoint {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  description?: string;
  type: WaypointType;
  imageUrl?: string;
}

type LayerVisibility = Record<PoiCategory, boolean>;

function MapClickHandler({ onMapClick, isPlacingPin }: { onMapClick: (latlng: { lat: number; lng: number }) => void; isPlacingPin: boolean }) {
  const map = useMap();
  useEffect(() => {
    map.getContainer().style.cursor = isPlacingPin ? 'crosshair' : '';
  }, [isPlacingPin, map]);

  useMapEvents({
    click(e) {
      if (isPlacingPin) onMapClick(e.latlng);
    },
  });
  return null;
}

function MapUpdater({ center, zoom }: { center: { lat: number; lng: number }; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], zoom ?? map.getZoom());
  }, [center, map, zoom]);
  return null;
}

const getTypeIcon = (type: WaypointType) => {
  switch (type) {
    case 'meeting': return <Car className="w-4 h-4" />;
    case 'attraction': return <MapPin className="w-4 h-4" />;
    case 'hotel': return <Hotel className="w-4 h-4" />;
    case 'restaurant': return <Utensils className="w-4 h-4" />;
    case 'shop': return <ShoppingBag className="w-4 h-4" />;
    case 'event': return <CalendarDays className="w-4 h-4" />;
    case 'activity': return <Users className="w-4 h-4" />;
    case 'end': return <Flag className="w-4 h-4" />;
    default: return <MapPin className="w-4 h-4" />;
  }
};

const getTypeColor = (_type: WaypointType) => '#18181b';

const createCustomIcon = (index: number, type: WaypointType) => {
  const color = getTypeColor(type);
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="
          background-color: ${color}; color: white; font-size: 12px; font-weight: bold;
          border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 6px rgba(0,0,0,0.15); border: 2px solid white;
        ">${index + 1}</div>
        <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid ${color};margin-top:-2px;"></div>
      </div>
    `,
    iconSize: [24, 36],
    iconAnchor: [12, 36],
  });
};

/** Lucide-style SVG icons for map markers (inline so Leaflet divIcon can use them) */
const POI_SVG: Record<PoiCategory, string> = {
  community: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"/></svg>`,
  landmark: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`,
  hotel: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 22v-6.57"/><path d="M12 11h.01"/><path d="M12 7h.01"/><path d="M14 15.43V22"/><path d="M15 16a5 5 0 0 0-6 0"/><path d="M16 11h.01"/><path d="M16 7h.01"/><path d="M8 11h.01"/><path d="M8 7h.01"/><rect x="4" y="2" width="16" height="20" rx="2"/></svg>`,
  restaurant: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`,
};

const createPoiIcon = (category: PoiCategory) => {
  const color = POI_LAYER_META[category].color;
  const isCommunity = category === 'community';
  const size = isCommunity ? 40 : category === 'landmark' ? 32 : 26;
  const iconSvg = POI_SVG[category];

  return L.divIcon({
    className: 'poi-leaflet-marker',
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.28));">
        <div style="
          background:${color}; width:${size}px; height:${size}px;
          border-radius:14px; display:flex; align-items:center; justify-content:center;
          border:2.5px solid white;
          ${isCommunity ? 'border-radius:16px; box-shadow:0 0 0 4px rgba(22,163,74,0.22);' : 'border-radius:12px;'}
        ">${iconSvg}</div>
        <div style="
          width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;
          border-top:7px solid ${color}; margin-top:-1px;
        "></div>
        ${isCommunity ? `<div style="
          margin-top:3px; background:#16a34a; color:white;
          font-size:9px; font-weight:700; padding:2px 7px; border-radius:999px;
          white-space:nowrap; letter-spacing:0.02em; font-family:system-ui,sans-serif;
        ">ชุมชน</div>` : ''}
      </div>
    `,
    iconSize: [size + 8, isCommunity ? size + 28 : size + 10],
    iconAnchor: [(size + 8) / 2, isCommunity ? size + 28 : size + 10],
    popupAnchor: [0, isCommunity ? -(size + 20) : -(size + 4)],
  });
};

function poiToWaypointType(category: PoiCategory): WaypointType {
  switch (category) {
    case 'community': return 'activity';
    case 'landmark': return 'attraction';
    case 'hotel': return 'hotel';
    case 'restaurant': return 'restaurant';
  }
}

function PlaceSearch({
  onPlaceSelect,
  communityHits,
  onCommunitySelect,
}: {
  onPlaceSelect: (place: { displayName: string; location: { lat: number; lng: number }; formattedAddress: string }) => void;
  communityHits: PhuketPoi[];
  onCommunitySelect: (poi: PhuketPoi) => void;
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (!query || query.length < 3) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const searchQuery = query.toLowerCase().includes('phuket') ? query : `${query} Phuket`;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&viewbox=98.2,8.2,98.5,7.7&bounded=1`
        );
        const data = await res.json();
        setResults(data || []);
      } catch {
        setResults([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const q = query.trim().toLowerCase();
  const localMatches =
    q.length >= 1
      ? communityHits.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.nameEn?.toLowerCase().includes(q) ||
            c.district.toLowerCase().includes(q)
        )
      : [];

  return (
    <div className="relative w-full sm:w-96">
      <div className="bg-surface p-2 rounded-2xl shadow-xl flex items-center gap-2 border border-surface-variant pointer-events-auto relative z-[1000]">
        <Search className="text-secondary ml-2 w-5 h-5 shrink-0" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border-none focus:ring-0 font-body-md text-body-md bg-transparent outline-none w-full"
          placeholder="ค้นหาชุมชน / สถานที่..."
          type="text"
        />
      </div>

      {(localMatches.length > 0 || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface rounded-xl shadow-xl border border-surface-variant overflow-hidden z-[1000] pointer-events-auto max-h-72 overflow-y-auto">
          {localMatches.length > 0 && (
            <>
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/5">
                ชุมชนสนับสนุน
              </div>
              {localMatches.map((poi) => (
                <button
                  key={poi.id}
                  onClick={() => {
                    onCommunitySelect(poi);
                    setQuery('');
                    setResults([]);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-primary/5 transition-colors border-b border-surface-variant flex items-start gap-3"
                >
                  <Trees className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-on-surface line-clamp-1">{poi.name}</div>
                    <div className="text-xs text-secondary line-clamp-1">{poi.district}</div>
                  </div>
                </button>
              ))}
            </>
          )}
          {results.map((place) => (
            <button
              key={place.place_id}
              onClick={() => {
                onPlaceSelect({
                  displayName: place.name || place.display_name.split(',')[0],
                  location: { lat: parseFloat(place.lat), lng: parseFloat(place.lon) },
                  formattedAddress: place.display_name,
                });
                setQuery('');
                setResults([]);
              }}
              className="w-full text-left px-4 py-3 hover:bg-surface-container-low transition-colors border-b border-surface-variant last:border-b-0 flex items-start gap-3"
            >
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-on-surface line-clamp-1">{place.name || place.display_name.split(',')[0]}</div>
                <div className="text-xs text-secondary line-clamp-2">{place.display_name}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const CREATION_STEPS = [
  { id: 1, label: 'ตั้งชื่อเส้นทาง', hint: 'ตั้งชื่อและคำอธิบาย', icon: PenLine },
  { id: 2, label: 'ปักหมุดเส้นทาง', hint: 'เลือกชุมชนหรือปักหมุดบนแผนที่', icon: MapPin },
  { id: 3, label: 'จัดลำดับจุด', hint: 'เรียงลำดับและใส่รายละเอียด', icon: ListOrdered },
  { id: 4, label: 'บันทึกเส้นทาง', hint: 'ตรวจสอบแล้วบันทึก', icon: Save },
] as const;

function getCreationStep(routeName: string, waypointCount: number): number {
  const hasName = routeName.trim().length > 0;
  if (!hasName) return 1;
  if (waypointCount === 0) return 2;
  if (waypointCount < 2) return 3;
  return 4;
}

function CreationStepGuide({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full">
      <div className="hidden sm:flex items-center gap-0">
        {CREATION_STEPS.map((step, index) => {
          const Icon = step.icon;
          const isDone = currentStep > step.id;
          const isActive = currentStep === step.id;
          return (
            <div key={step.id} className="flex items-center flex-1 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                    isDone
                      ? 'bg-primary border-primary text-on-primary'
                      : isActive
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-surface border-surface-variant text-secondary'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <div className="min-w-0 hidden lg:block">
                  <div className={`text-xs font-bold truncate ${isActive ? 'text-primary' : isDone ? 'text-on-surface' : 'text-secondary'}`}>
                    {step.label}
                  </div>
                  {isActive && <div className="text-[10px] text-secondary truncate">{step.hint}</div>}
                </div>
              </div>
              {index < CREATION_STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 rounded-full min-w-[12px] ${currentStep > step.id ? 'bg-primary' : 'bg-surface-variant'}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="sm:hidden">
        <div className="flex items-center justify-between gap-2 mb-2">
          {CREATION_STEPS.map((step) => {
            const isDone = currentStep > step.id;
            const isActive = currentStep === step.id;
            return (
              <div
                key={step.id}
                className={`h-1.5 flex-1 rounded-full transition-colors ${isDone || isActive ? 'bg-primary' : 'bg-surface-variant'}`}
              />
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          {(() => {
            const step = CREATION_STEPS[currentStep - 1];
            const Icon = step.icon;
            return (
              <>
                <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary text-primary flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-primary">
                    ขั้นที่ {currentStep}/{CREATION_STEPS.length}: {step.label}
                  </div>
                  <div className="text-[11px] text-secondary truncate">{step.hint}</div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

function LayerToggle({
  layers,
  onToggle,
  expanded,
  onExpandedChange,
}: {
  layers: LayerVisibility;
  onToggle: (key: PoiCategory) => void;
  expanded: boolean;
  onExpandedChange: (v: boolean) => void;
}) {
  const icons: Record<PoiCategory, ReactNode> = {
    community: <Trees className="w-3.5 h-3.5" />,
    landmark: <Landmark className="w-3.5 h-3.5" />,
    hotel: <Hotel className="w-3.5 h-3.5" />,
    restaurant: <Utensils className="w-3.5 h-3.5" />,
  };

  const activeCount = (Object.keys(layers) as PoiCategory[]).filter((k) => layers[k]).length;

  return (
    <div className="relative">
      <button
        onClick={() => onExpandedChange(!expanded)}
        className={`h-10 px-3 rounded-xl shadow-lg border transition-colors flex items-center justify-center gap-2 ${
          expanded
            ? 'bg-primary/10 text-primary border-primary/30'
            : 'bg-surface text-on-surface border-surface-variant hover:bg-surface-container-low'
        }`}
        title="เลเยอร์แผนที่"
      >
        <Layers className="w-4 h-4" />
        <span className="font-bold text-sm hidden sm:block">เลเยอร์</span>
        <span className="text-[10px] font-bold bg-primary/15 text-primary px-1.5 py-0.5 rounded-full">{activeCount}</span>
      </button>

      {expanded && (
        <div className="absolute top-full right-0 mt-2 bg-surface rounded-2xl shadow-xl border border-surface-variant overflow-hidden min-w-[200px] z-[1001]">
          {(Object.keys(POI_LAYER_META) as PoiCategory[]).map((key) => {
            const meta = POI_LAYER_META[key];
            const on = layers[key];
            return (
              <button
                key={key}
                onClick={() => onToggle(key)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors border-b border-surface-variant last:border-b-0 ${
                  on ? 'bg-white' : 'bg-surface-container-low/50 opacity-60'
                }`}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0"
                  style={{ backgroundColor: on ? meta.color : '#9ca3af' }}
                >
                  {icons[key]}
                </span>
                <span className="flex-1 font-medium text-on-surface">{meta.label}</span>
                <span
                  className={`w-8 h-4 rounded-full relative transition-colors ${on ? 'bg-primary' : 'bg-surface-variant'}`}
                >
                  <span
                    className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${
                      on ? 'left-4' : 'left-0.5'
                    }`}
                  />
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MapToolbar({
  isPlacingPin,
  onTogglePin,
  showCommunityList,
  onToggleCommunityList,
  layers,
  onToggleLayer,
  layersExpanded,
  onLayersExpandedChange,
  onNewRoute,
  showNewRoute,
}: {
  isPlacingPin: boolean;
  onTogglePin: () => void;
  showCommunityList: boolean;
  onToggleCommunityList: () => void;
  layers: LayerVisibility;
  onToggleLayer: (key: PoiCategory) => void;
  layersExpanded: boolean;
  onLayersExpandedChange: (v: boolean) => void;
  onNewRoute: () => void;
  showNewRoute: boolean;
}) {
  return (
    <div className="bg-surface/95 backdrop-blur-sm rounded-2xl shadow-xl border border-surface-variant p-1.5 flex items-center gap-1">
      {showNewRoute && (
        <button
          onClick={onNewRoute}
          className="h-10 px-3 bg-primary text-on-primary font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm hidden md:block">สร้างใหม่</span>
        </button>
      )}

      <div className="w-px h-6 bg-surface-variant shrink-0 hidden md:block" />

      <button
        onClick={onTogglePin}
        className={`h-10 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 shrink-0 ${
          isPlacingPin
            ? 'bg-primary text-on-primary'
            : 'text-on-surface hover:bg-surface-container-low'
        }`}
        title="ปักหมุดบนแผนที่"
      >
        <MapPin className="w-4 h-4" />
        <span className="font-bold text-sm hidden md:block">{isPlacingPin ? 'คลิกแผนที่' : 'ปักหมุด'}</span>
      </button>

      <button
        onClick={onToggleCommunityList}
        className={`h-10 px-3 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 ${
          showCommunityList ? 'bg-primary/10 text-primary' : 'text-on-surface hover:bg-surface-container-low'
        }`}
        title="รายการชุมชน"
      >
        <Trees className="w-4 h-4" />
        <span className="font-bold text-sm hidden md:block">ชุมชน</span>
      </button>

      <LayerToggle
        layers={layers}
        onToggle={onToggleLayer}
        expanded={layersExpanded}
        onExpandedChange={onLayersExpandedChange}
      />
    </div>
  );
}

function CommunityStarterList({
  onSelect,
  onAdd,
}: {
  onSelect: (poi: PhuketPoi) => void;
  onAdd: (poi: PhuketPoi) => void;
}) {
  return (
    <div className="bg-surface rounded-2xl shadow-xl border border-surface-variant overflow-hidden w-full sm:w-72 max-h-[42vh] flex flex-col">
      <div className="px-3 py-2.5 border-b border-surface-variant bg-primary/5 shrink-0">
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-primary uppercase tracking-wider">เริ่มจากชุมชน</span>
        </div>
        <p className="text-[11px] text-secondary mt-1 leading-snug">
          จุดสีเขียว = ชุมชนที่ได้รับการสนับสนุนจากข้อมูลท้องถิ่น
        </p>
      </div>
      <div className="overflow-y-auto flex-1">
        {COMMUNITY_POIS.map((poi) => (
          <div
            key={poi.id}
            className="flex items-stretch border-b border-surface-variant last:border-b-0 hover:bg-primary/5 transition-colors"
          >
            <button onClick={() => onSelect(poi)} className="flex-1 text-left px-3 py-2.5 min-w-0">
              <div className="font-bold text-sm text-on-surface truncate">{poi.name.replace('ชุมชน', '')}</div>
              <div className="text-[11px] text-secondary truncate">{poi.district}</div>
            </button>
            <button
              onClick={() => onAdd(poi)}
              title="เพิ่มในเส้นทาง"
              className="px-2.5 text-primary hover:bg-primary/10 border-l border-surface-variant"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PoiPopupContent({ poi, onAdd }: { poi: PhuketPoi; onAdd: () => void }) {
  const meta = POI_LAYER_META[poi.category];
  return (
    <div className="min-w-[220px] max-w-[260px] font-body-md">
      <div className="flex items-start gap-2 mb-2">
        <span
          className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full text-white shrink-0 mt-0.5"
          style={{ backgroundColor: meta.color }}
        >
          {meta.label}
        </span>
        {poi.endorsed && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
            ททท. ท้องถิ่น
          </span>
        )}
      </div>
      <h4 className="font-bold text-base text-on-surface leading-tight mb-0.5">{poi.name}</h4>
      <p className="text-xs text-secondary mb-2">{poi.district}</p>
      <p className="text-xs text-on-surface leading-relaxed mb-2">{poi.highlight}</p>
      {poi.activities && poi.activities.length > 0 && (
        <p className="text-[11px] text-secondary mb-1">
          <span className="font-bold text-on-surface">กิจกรรม: </span>
          {poi.activities.slice(0, 3).join(' · ')}
        </p>
      )}
      {poi.food && poi.food.length > 0 && (
        <p className="text-[11px] text-secondary mb-3">
          <span className="font-bold text-on-surface">อาหารเด่น: </span>
          {poi.food.slice(0, 2).join(' · ')}
        </p>
      )}
      <button
        onClick={onAdd}
        className="w-full mt-1 py-2 rounded-lg bg-primary text-white text-sm font-bold flex items-center justify-center gap-1.5 hover:opacity-90"
      >
        <Plus className="w-4 h-4" />
        เพิ่มในเส้นทาง
      </button>
    </div>
  );
}

export default function RouteWizard() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [routeName, setRouteName] = useState('');
  const [routeDescription, setRouteDescription] = useState('');
  const [center, setCenter] = useState({ lat: 7.95, lng: 98.35 });
  const [mapZoom, setMapZoom] = useState(13);
  const [routePath, setRoutePath] = useState<[number, number][]>([]);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPlacingPin, setIsPlacingPin] = useState(false);
  const [routeStats, setRouteStats] = useState<{ distance: number; duration: number } | null>(null);
  const [layers, setLayers] = useState<LayerVisibility>({
    community: true,
    landmark: true,
    hotel: false,
    restaurant: false,
  });
  const [showCommunityList, setShowCommunityList] = useState(true);
  const [layersExpanded, setLayersExpanded] = useState(false);

  const creationStep = useMemo(() => getCreationStep(routeName, waypoints.length), [routeName, waypoints.length]);

  const visiblePois = useMemo(
    () => ALL_POIS.filter((p) => layers[p.category]),
    [layers]
  );

  useEffect(() => {
    if (waypoints.length < 2) {
      setRoutePath([]);
      setRouteStats(null);
      return;
    }

    const fetchRoute = async () => {
      try {
        const coordinates = waypoints.map((wp) => `${wp.location.lng},${wp.location.lat}`).join(';');
        const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          setRoutePath(route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]));
          setRouteStats({ distance: route.distance, duration: route.duration });
        } else {
          setRoutePath(waypoints.map((w) => [w.location.lat, w.location.lng]));
          setRouteStats(null);
        }
      } catch {
        setRoutePath(waypoints.map((w) => [w.location.lat, w.location.lng]));
        setRouteStats(null);
      }
    };

    fetchRoute();
  }, [waypoints]);

  const addPoiToRoute = (poi: PhuketPoi) => {
    const already = waypoints.some(
      (w) => Math.abs(w.location.lat - poi.location.lat) < 0.0005 && Math.abs(w.location.lng - poi.location.lng) < 0.0005
    );
    if (already) {
      setCenter(poi.location);
      setMapZoom(14);
      setIsSidebarOpen(true);
      return;
    }

    const descParts = [poi.highlight];
    if (poi.activities?.length) descParts.push(`กิจกรรม: ${poi.activities.join(', ')}`);
    if (poi.food?.length) descParts.push(`อาหารเด่น: ${poi.food.join(', ')}`);

    const newId = Math.random().toString(36).substring(7);
    const wp: Waypoint = {
      id: newId,
      name: poi.name,
      location: poi.location,
      description: descParts.join('\n'),
      type: waypoints.length === 0 ? 'meeting' : poiToWaypointType(poi.category),
    };

    setWaypoints((prev) => [...prev, wp]);
    setEditingId(newId);
    setCenter(poi.location);
    setMapZoom(14);
    setIsSidebarOpen(true);
    if (!routeName) setRouteName('เส้นทางชุมชนภูเก็ต');
  };

  const focusPoi = (poi: PhuketPoi) => {
    setCenter(poi.location);
    setMapZoom(14);
  };

  const removeWaypoint = (id: string) => {
    setWaypoints(waypoints.filter((w) => w.id !== id));
  };

  const updateWaypoint = (id: string, updates: Partial<Waypoint>) => {
    setWaypoints(waypoints.map((w) => (w.id === id ? { ...w, ...updates } : w)));
  };

  const moveWaypoint = (index: number, direction: 'up' | 'down') => {
    const next = [...waypoints];
    if (direction === 'up' && index > 0) {
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
    } else if (direction === 'down' && index < next.length - 1) {
      [next[index + 1], next[index]] = [next[index], next[index + 1]];
    }
    setWaypoints(next);
  };

  const formatDistance = (meters: number) => (meters / 1000).toFixed(1) + ' กม.';

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours} ชม. ${minutes} นาที`;
    return `${minutes} นาที`;
  };

  const handleSave = () => {
    const existingRoutes = JSON.parse(localStorage.getItem('myRoutes') || '[]');
    const newRoute = {
      id: Date.now().toString(),
      name: routeName || 'เส้นทางไม่มีชื่อ',
      description: routeDescription,
      waypoints,
      routeStats,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('myRoutes', JSON.stringify([...existingRoutes, newRoute]));
    navigate('/creator/routes');
  };

  const handleMapClick = async (latlng: { lat: number; lng: number }) => {
    setIsPlacingPin(false);
    if (!isSidebarOpen) {
      setIsSidebarOpen(true);
    }

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`);
      const data = await res.json();
      const newId = Math.random().toString(36).substring(7);
      setWaypoints((prev) => [
        ...prev,
        {
          id: newId,
          name: data.name || data.display_name?.split(',')[0] || 'สถานที่ใหม่',
          location: latlng,
          description: data.display_name,
          type: prev.length === 0 ? 'meeting' : 'attraction',
        },
      ]);
      setEditingId(newId);
      setCenter(latlng);
      setMapZoom(14);
    } catch {
      const newId = Math.random().toString(36).substring(7);
      setWaypoints((prev) => [
        ...prev,
        {
          id: newId,
          name: 'สถานที่ใหม่',
          location: latlng,
          description: '',
          type: prev.length === 0 ? 'meeting' : 'attraction',
        },
      ]);
      setEditingId(newId);
      setCenter(latlng);
    }
  };

  const startNewRoute = () => {
    setIsSidebarOpen(true);
    setWaypoints([]);
    setRouteName('');
    setRouteDescription('');
    setRoutePath([]);
    setEditingId(null);
    setIsPlacingPin(false);
  };

  return (
    <motion.div
      className="flex-1 flex flex-col h-[calc(100vh-80px)] md:h-screen overflow-hidden bg-surface relative"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <header className="shrink-0 bg-surface shadow-sm z-30 border-b border-surface-variant">
        <div className="flex items-center justify-between px-4 md:px-8 py-3 gap-4">
          <div className="min-w-0 shrink-0">
            <h2 className="font-headline-md text-xl md:text-2xl font-bold text-primary">สร้างเส้นทาง</h2>
            <p className="text-xs text-secondary mt-0.5 hidden sm:block">จุดสีเขียว = ชุมชนที่ได้รับการสนับสนุน</p>
          </div>
          <div className="flex-1 min-w-0 max-w-3xl">
            <CreationStepGuide currentStep={creationStep} />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden flex-col md:flex-row relative">
        <section className="flex-1 relative overflow-hidden group z-10">
          <MapContainer
            center={[center.lat, center.lng]}
            zoom={13}
            minZoom={10}
            maxBounds={[
              [7.5, 98.1],
              [8.3, 98.6],
            ]}
            maxBoundsViscosity={1.0}
            style={{ width: '100%', height: '100%' }}
            zoomControl={false}
          >
            <ZoomControl position="bottomright" />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapUpdater center={center} zoom={mapZoom} />
            <MapClickHandler onMapClick={handleMapClick} isPlacingPin={isPlacingPin} />

            {layers.community &&
              COMMUNITY_POIS.map((poi) => (
                <Circle
                  key={`aura-${poi.id}`}
                  center={[poi.location.lat, poi.location.lng]}
                  radius={900}
                  pathOptions={{
                    color: '#16a34a',
                    weight: 1,
                    opacity: 0.35,
                    fillColor: '#16a34a',
                    fillOpacity: 0.08,
                  }}
                />
              ))}

            {visiblePois.map((poi) => (
              <Marker
                key={poi.id}
                position={[poi.location.lat, poi.location.lng]}
                icon={createPoiIcon(poi.category)}
                zIndexOffset={poi.category === 'community' ? 400 : 100}
              >
                <Popup>
                  <PoiPopupContent poi={poi} onAdd={() => addPoiToRoute(poi)} />
                </Popup>
              </Marker>
            ))}

            {waypoints.map((wp, i) => (
              <Marker
                key={wp.id}
                position={[wp.location.lat, wp.location.lng]}
                icon={createCustomIcon(i, wp.type)}
                zIndexOffset={600}
                eventHandlers={{
                  click: () => {
                    setIsSidebarOpen(true);
                    setEditingId(wp.id);
                    setCenter(wp.location);
                  },
                }}
              />
            ))}

            {routePath.length > 1 && (
              <Polyline positions={routePath} pathOptions={{ color: '#3b82f6', weight: 4, opacity: 0.8 }} />
            )}
          </MapContainer>

          <div className="absolute top-3 left-3 right-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 pointer-events-none z-[1000]">
            <div className="flex flex-col gap-2 pointer-events-auto min-w-0 sm:max-w-[min(100%,22rem)]">
              <PlaceSearch
                communityHits={COMMUNITY_POIS}
                onCommunitySelect={(poi) => {
                  focusPoi(poi);
                }}
                onPlaceSelect={(place) => {
                  const newId = Math.random().toString(36).substring(7);
                  setWaypoints([
                    ...waypoints,
                    {
                      id: newId,
                      name: place.displayName || 'สถานที่ใหม่',
                      location: place.location,
                      description: place.formattedAddress || '',
                      type: waypoints.length === 0 ? 'meeting' : 'attraction',
                    },
                  ]);
                  setCenter(place.location);
                  setMapZoom(14);
                  setEditingId(newId);
                  setIsSidebarOpen(true);
                }}
              />
              {showCommunityList && (
                <CommunityStarterList onSelect={focusPoi} onAdd={addPoiToRoute} />
              )}
            </div>

            <div className="pointer-events-auto shrink-0 self-end sm:self-start">
              <MapToolbar
                isPlacingPin={isPlacingPin}
                onTogglePin={() => setIsPlacingPin((v) => !v)}
                showCommunityList={showCommunityList}
                onToggleCommunityList={() => setShowCommunityList((v) => !v)}
                layers={layers}
                onToggleLayer={(key) => setLayers((prev) => ({ ...prev, [key]: !prev[key] }))}
                layersExpanded={layersExpanded}
                onLayersExpandedChange={setLayersExpanded}
                onNewRoute={startNewRoute}
                showNewRoute={!isSidebarOpen}
              />
            </div>
          </div>
        </section>

        {isSidebarOpen && (
          <aside className="w-full md:w-[420px] bg-surface-container-lowest border-t md:border-t-0 md:border-l border-surface-variant flex flex-col shadow-2xl z-20 md:h-full h-[60vh] shrink-0 animate-in slide-in-from-right-8 duration-300">
            <div className="p-4 border-b border-surface-container-low shrink-0 bg-surface space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider">
                  {creationStep === 1 ? 'ขั้นที่ 1 · ตั้งชื่อเส้นทาง' : 'ข้อมูลเส้นทาง'}
                </label>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-secondary hover:bg-surface-container-low rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div>
                <input
                  type="text"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  className="w-full font-headline-md text-xl font-bold bg-transparent border-none p-0 focus:ring-0 text-on-surface placeholder:text-on-surface/30"
                  placeholder="ตั้งชื่อเส้นทาง เช่น เส้นทางชุมชนถลาง"
                />
              </div>
              <div>
                <textarea
                  value={routeDescription}
                  onChange={(e) => setRouteDescription(e.target.value)}
                  className="w-full text-sm font-medium bg-transparent border-none p-0 focus:ring-0 text-secondary resize-none placeholder:text-secondary/50"
                  placeholder="อธิบายว่าเส้นทางนี้พิเศษอย่างไร..."
                  rows={2}
                />
              </div>

              {creationStep === 2 && waypoints.length === 0 && (
                <div className="rounded-xl bg-primary/5 border border-primary/20 px-3 py-2.5 text-xs text-on-surface leading-relaxed">
                  <span className="font-bold text-primary">ขั้นถัดไป: </span>
                  กดหมุดชุมชนสีเขียวบนแผนที่ หรือใช้ปุ่ม <strong>ปักหมุด</strong> / รายการ <strong>ชุมชน</strong>
                </div>
              )}

              {routeStats && (
                <div className="flex items-center gap-4 pt-3 border-t border-surface-variant">
                  <div className="flex items-center gap-1.5 text-secondary">
                    <RouteIcon className="w-4 h-4" />
                    <span className="text-sm font-bold">{formatDistance(routeStats.distance)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-secondary">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-bold">{formatDuration(routeStats.duration)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4 bg-surface-container-lowest">
              <h3 className="font-bold text-sm text-secondary uppercase tracking-wider flex items-center justify-between">
                <span>จุดแวะ ({waypoints.length})</span>
              </h3>

              {waypoints.map((wp, index) => (
                <div
                  key={wp.id}
                  className={`bg-surface p-4 rounded-2xl border transition-all ${
                    editingId === wp.id ? 'border-primary ring-2 ring-primary/20 shadow-md' : 'border-surface-variant shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex gap-4 group cursor-pointer" onClick={() => setEditingId(editingId === wp.id ? null : wp.id)}>
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 text-sm"
                        style={{ backgroundColor: getTypeColor(wp.type), color: 'white' }}
                      >
                        {index + 1}
                      </div>
                      {index < waypoints.length - 1 && <div className="w-0.5 h-full min-h-8 flex-1 bg-surface-variant rounded-full my-1" />}
                    </div>
                    <div className="flex-1 min-w-0 pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-base leading-tight mb-1 text-on-surface truncate pr-2">{wp.name}</h4>
                          <div className="flex items-center gap-2 text-xs font-medium text-secondary mb-2" style={{ color: getTypeColor(wp.type) }}>
                            {getTypeIcon(wp.type)}
                            <span>{WAYPOINT_TYPE_LABELS[wp.type]}</span>
                          </div>
                          {editingId !== wp.id && (
                            <p className="font-medium text-xs text-secondary line-clamp-2">{wp.description || 'ยังไม่มีคำอธิบาย'}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex flex-col -space-y-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveWaypoint(index, 'up');
                              }}
                              disabled={index === 0}
                              className="text-secondary hover:text-on-surface transition-colors p-1 disabled:opacity-30"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveWaypoint(index, 'down');
                              }}
                              disabled={index === waypoints.length - 1}
                              className="text-secondary hover:text-on-surface transition-colors p-1 disabled:opacity-30"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeWaypoint(wp.id);
                            }}
                            className="text-secondary hover:text-error transition-colors p-2 rounded-full hover:bg-error/10 ml-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {editingId === wp.id && (
                    <div className="ml-12 mt-2 space-y-4 pt-4 border-t border-surface-variant">
                      <div>
                        <label className="block text-xs font-bold text-secondary mb-1">ชื่อสถานที่</label>
                        <input
                          type="text"
                          value={wp.name}
                          onChange={(e) => updateWaypoint(wp.id, { name: e.target.value })}
                          className="w-full text-sm p-2 rounded-lg border border-surface-variant bg-surface focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-secondary mb-1">ประเภทสถานที่</label>
                        <select
                          value={wp.type}
                          onChange={(e) => updateWaypoint(wp.id, { type: e.target.value as WaypointType })}
                          className="w-full text-sm p-2 rounded-lg border border-surface-variant bg-surface focus:ring-2 focus:ring-primary/20 outline-none"
                        >
                          <option value="meeting">จุดนัดพบ</option>
                          <option value="hotel">โรงแรมที่พัก</option>
                          <option value="restaurant">ร้านอาหาร</option>
                          <option value="attraction">จุดท่องเที่ยว</option>
                          <option value="shop">ร้านค้า</option>
                          <option value="event">งานอีเว้นท์</option>
                          <option value="activity">กิจกรรมชาวบ้าน</option>
                          <option value="end">จุดสิ้นสุด</option>
                          <option value="custom">อื่นๆ</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-secondary mb-1">รายละเอียด</label>
                        <textarea
                          value={wp.description || ''}
                          onChange={(e) => updateWaypoint(wp.id, { description: e.target.value })}
                          className="w-full text-sm p-2 rounded-lg border border-surface-variant bg-surface focus:ring-2 focus:ring-primary/20 outline-none resize-y min-h-[80px]"
                          placeholder="ใส่รายละเอียด เช่น กิจกรรม เวลา หรือคำแนะนำ..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-secondary mb-1">ลิงก์รูปภาพ</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={wp.imageUrl || ''}
                            onChange={(e) => updateWaypoint(wp.id, { imageUrl: e.target.value })}
                            className="flex-1 text-sm p-2 rounded-lg border border-surface-variant bg-surface focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                        {wp.imageUrl && (
                          <div className="mt-2 h-32 rounded-lg overflow-hidden border border-surface-variant">
                            <img
                              src={wp.imageUrl}
                              alt={wp.name}
                              className="w-full h-full object-cover"
                              onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {waypoints.length === 0 && (
                <div className="text-center py-12 text-secondary bg-surface rounded-2xl border border-dashed border-surface-variant">
                  <Trees className="w-12 h-12 mx-auto mb-3 opacity-30 text-primary" />
                  <p className="text-sm font-bold text-on-surface">ยังไม่มีจุดในเส้นทาง</p>
                  <p className="text-xs mt-1 px-4">กดหมุดชุมชนสีเขียว หรือใช้รายการ “เริ่มจากชุมชน” เพื่อเพิ่มจุด</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-surface-variant bg-surface shrink-0 space-y-2">
              {creationStep < 4 && (
                <p className="text-[11px] text-center text-secondary">
                  {creationStep === 1 && 'ตั้งชื่อเส้นทางก่อน แล้วเพิ่มจุดแวะบนแผนที่'}
                  {creationStep === 2 && 'เพิ่มอย่างน้อย 1 จุดแวะจากชุมชนหรือปักหมุด'}
                  {creationStep === 3 && 'เพิ่มจุดที่ 2 เพื่อให้ระบบคำนวณเส้นทาง'}
                </p>
              )}
              <button
                onClick={handleSave}
                disabled={!routeName.trim() || waypoints.length === 0}
                className="w-full h-12 bg-primary text-on-primary font-bold rounded-xl shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none disabled:scale-100"
              >
                <Save className="w-4 h-4" />
                บันทึกเส้นทาง
              </button>
            </div>
          </aside>
        )}
      </div>
    </motion.div>
  );
}
