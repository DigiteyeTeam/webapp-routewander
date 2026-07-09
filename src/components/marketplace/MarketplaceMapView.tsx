import rwpPin from '../../images/rwp.png';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Sparkles, MapPin, Clock, Star, ChevronLeft, PanelLeftOpen } from 'lucide-react';
import {
  CATEGORY_META,
  formatPrice,
  getRouteCenter,
  type MarketplaceRoute,
} from '../../data/marketplaceRoutes';
import { COMMUNITY_POIS } from '../../data/phuketPois';
import MapAIChatPanel, { MapAICollapsedFab } from './MapAIChatPanel';
import WelcomeOverlay from '../WelcomeOverlay';
import MapPromoBanner from './MapPromoBanner';
import {
  MapSlidePanel,
  CommunityMapDetail,
  CommunityMapDetailFooter,
  RouteMapDetail,
  RouteMapDetailFooter,
} from './MapDetailPanels';

const PHUKET_CENTER = { lat: 7.95, lng: 98.35 };
const DEFAULT_ZOOM = 12;
const SELECTED_ZOOM = 15;
const MAP_PIN_COLOR = CATEGORY_META.nature.color;

L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.9.4/dist/images/';

function createRouteMarkerIcon(selected: boolean) {
  const size = selected ? 48 : 40;
  const border = selected ? 5 : 4;
  const outer = size + border * 2;
  const tail = 10;
  const totalH = outer + tail;

  return L.divIcon({
    className: `marketplace-pin${selected ? ' marketplace-pin--selected' : ''}`,
    html: `
      <div class="marketplace-pin-wrap${selected ? ' marketplace-pin-wrap--selected' : ''}" style="--pin-color:${MAP_PIN_COLOR}">
        <div class="marketplace-pin-circle" style="width:${size}px;height:${size}px;border-width:${border}px">
          <img src="${rwpPin}" alt="" draggable="false" />
        </div>
        <div class="marketplace-pin-tail"></div>
      </div>
    `,
    iconSize: [outer, totalH],
    iconAnchor: [outer / 2, totalH],
    popupAnchor: [0, -totalH + 4],
  });
}

function createCommunityMarkerIcon(imageUrl: string, communityNo: number) {
  const size = 36;
  const border = 3;
  const outer = size + border * 2;

  return L.divIcon({
    className: 'community-map-pin',
    html: `
      <div class="community-pin-wrap" style="--pin-color:${MAP_PIN_COLOR}">
        <div class="community-pin-circle" style="width:${size}px;height:${size}px;border-width:${border}px">
          <img src="${imageUrl}" alt="" draggable="false" />
        </div>
        <span class="community-pin-badge">${communityNo}</span>
      </div>
    `,
    iconSize: [outer, outer],
    iconAnchor: [outer / 2, outer / 2],
    popupAnchor: [0, -outer / 2],
  });
}

function MapFocus({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([center.lat, center.lng], zoom, { duration: 0.6 });
  }, [center, zoom, map]);
  return null;
}

function MapResizeFix() {
  const map = useMap();

  useEffect(() => {
    const invalidate = () => {
      map.invalidateSize({ animate: false });
    };

    const raf = requestAnimationFrame(invalidate);
    const t1 = window.setTimeout(invalidate, 100);
    const t2 = window.setTimeout(invalidate, 350);

    window.addEventListener('resize', invalidate);

    const container = map.getContainer().parentElement;
    const observer = container
      ? new ResizeObserver(() => {
          requestAnimationFrame(invalidate);
        })
      : null;
    if (container) observer?.observe(container);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener('resize', invalidate);
      observer?.disconnect();
    };
  }, [map]);

  return null;
}

interface MarketplaceMapViewProps {
  routes: MarketplaceRoute[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  fullscreen?: boolean;
}

export default function MarketplaceMapView({
  routes,
  selectedId,
  onSelect,
  fullscreen = false,
}: MarketplaceMapViewProps) {
  const [aiChatOpen, setAiChatOpen] = useState(true);
  const [listCollapsed, setListCollapsed] = useState(false);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);

  const selected = routes.find((r) => r.id === selectedId) ?? null;
  const selectedCommunity = useMemo(
    () => COMMUNITY_POIS.find((c) => c.id === selectedCommunityId) ?? null,
    [selectedCommunityId],
  );

  const mapCenter = useMemo(() => {
    if (selectedCommunity) return selectedCommunity.location;
    if (selected) return getRouteCenter(selected);
    return PHUKET_CENTER;
  }, [selectedCommunity, selected]);

  const mapZoom = selectedCommunity || selected ? SELECTED_ZOOM : DEFAULT_ZOOM;

  const selectRoute = (id: string | null) => {
    setSelectedCommunityId(null);
    onSelect(id);
  };

  const selectCommunity = (id: string | null) => {
    onSelect(null);
    setSelectedCommunityId(id);
  };

  const closeMapPanel = () => {
    setSelectedCommunityId(null);
    onSelect(null);
  };

  const mapArea = (
    <div
      className={`relative min-w-0 min-h-0 overflow-hidden ${
        fullscreen ? 'flex-1 h-full w-full min-h-[50vh] lg:min-h-0' : 'flex-1 min-h-[340px] lg:min-h-0'
      }`}
    >
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={[PHUKET_CENTER.lat, PHUKET_CENTER.lng]}
          zoom={DEFAULT_ZOOM}
          minZoom={11}
          maxBounds={[
            [7.5, 98.1],
            [8.35, 98.55],
          ]}
          maxBoundsViscosity={0.85}
          style={{ width: '100%', height: '100%' }}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapResizeFix />
          <MapFocus center={mapCenter} zoom={mapZoom} />

          {/* หมุดเส้นทาง 20 routes */}
          {routes.map((route) => {
            const isSelected = route.id === selectedId;
            const center = getRouteCenter(route);

            return (
              <Marker
                key={route.id}
                position={[center.lat, center.lng]}
                icon={createRouteMarkerIcon(isSelected)}
                zIndexOffset={isSelected ? 500 : 100}
                eventHandlers={{
                  click: () => selectRoute(isSelected ? null : route.id),
                }}
              />
            );
          })}

          {/* หมุดชุมชน 15 ตำบล */}
          {COMMUNITY_POIS.map((community) => {
            const isActive = community.id === selectedCommunityId;
            return (
              <Marker
                key={`community-${community.id}`}
                position={[community.location.lat, community.location.lng]}
                icon={createCommunityMarkerIcon(community.imageUrl ?? '', community.communityNo ?? 0)}
                zIndexOffset={isActive ? 600 : 300 + (community.communityNo ?? 0)}
                eventHandlers={{
                  click: () => selectCommunity(isActive ? null : community.id),
                }}
              />
            );
          })}
        </MapContainer>
      </div>

      <MapPromoBanner />

      {fullscreen && <WelcomeOverlay />}

      {listCollapsed && (
        <button
          type="button"
          onClick={() => setListCollapsed(false)}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-[400] lg:hidden flex items-center gap-2 px-3 py-2 rounded-full bg-white/95 border border-surface-variant shadow-lg text-xs font-bold text-primary hover:bg-white transition-colors"
          aria-label="เปิดรายการเส้นทาง"
        >
          <PanelLeftOpen className="w-4 h-4" />
          เส้นทาง
        </button>
      )}

      {selectedCommunity && (
        <MapSlidePanel
          onClose={() => setSelectedCommunityId(null)}
          footer={<CommunityMapDetailFooter community={selectedCommunity} />}
        >
          <CommunityMapDetail community={selectedCommunity} />
        </MapSlidePanel>
      )}

      {selected && !selectedCommunity && (
        <MapSlidePanel onClose={closeMapPanel} footer={<RouteMapDetailFooter route={selected} />}>
          <RouteMapDetail route={selected} />
        </MapSlidePanel>
      )}
    </div>
  );

  const routeList = (
    <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
      {routes.map((route) => {
        const meta = CATEGORY_META[route.category];
        const isActive = route.id === selectedId;
        return (
          <button
            key={route.id}
            type="button"
            onClick={() => selectRoute(isActive ? null : route.id)}
            className={`w-full text-left p-3 rounded-xl border transition-all ${
              isActive
                ? 'border-primary bg-primary/5 shadow-sm ring-2 ring-primary/20'
                : 'border-surface-variant hover:border-primary/30 hover:bg-surface-container-low'
            }`}
          >
            <div className="flex gap-3">
              <img src={route.image} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: meta.color }} />
                  <span className="text-[10px] font-bold text-secondary">{meta.label}</span>
                </div>
                <p className="font-bold text-sm text-on-surface truncate">{route.title}</p>
                <p className="text-xs text-secondary truncate">{route.creator.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-primary">{formatPrice(route.price)}</span>
                  <span className="text-[10px] text-violet-600 font-bold flex items-center gap-0.5">
                    <Sparkles className="w-3 h-3" /> {route.aiMatch}%
                  </span>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );

  const routeListPanel = (
    <aside className="flex flex-col h-full min-h-0 bg-surface-container-lowest rounded-2xl border border-surface-variant shadow-lg overflow-hidden">
      <div className="p-4 border-b border-surface-variant shrink-0 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-bold text-on-surface text-sm">เส้นทางบนแผนที่</h3>
          <p className="text-xs text-secondary mt-0.5">
            {routes.length} เส้นทาง · คลิกหมุดเพื่อดูรายละเอียด
          </p>
        </div>
        <button
          type="button"
          onClick={() => setListCollapsed(true)}
          className="shrink-0 p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-surface-container-low transition-colors"
          title="ย่อรายการ"
          aria-label="ย่อรายการเส้นทาง"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
      {routeList}
      {selected && (
        <div className="p-4 border-t border-surface-variant bg-surface shrink-0">
          <h4 className="font-bold text-sm text-on-surface mb-2 line-clamp-1">{selected.title}</h4>
          <div className="flex flex-wrap gap-2 text-xs text-secondary mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {selected.stops} จุด
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {selected.duration}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {selected.rating}
            </span>
          </div>
          <Link
            to={`/route/${selected.id}`}
            className="block w-full h-11 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            ดูรายละเอียดเส้นทาง
          </Link>
        </div>
      )}
    </aside>
  );

  if (fullscreen) {
    return (
      <div className="flex flex-1 min-h-0 min-w-0 h-full flex-col lg:flex-row">
        {listCollapsed ? (
          <div className="hidden lg:flex order-1 w-12 shrink-0 flex-col items-center py-3 pl-3 pb-3">
            <button
              type="button"
              onClick={() => setListCollapsed(false)}
              className="w-10 h-10 rounded-xl bg-surface-container-lowest border border-surface-variant text-primary shadow-md flex items-center justify-center hover:border-primary/40 hover:bg-primary/5 transition-colors"
              title="เปิดรายการเส้นทาง"
              aria-label="เปิดรายการเส้นทาง"
            >
              <PanelLeftOpen className="w-5 h-5" />
            </button>
            <span
              className="mt-2 text-[10px] font-bold text-primary"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              เส้นทาง
            </span>
          </div>
        ) : (
          <div className="order-2 lg:order-1 w-full lg:w-[300px] xl:w-[320px] shrink-0 flex flex-col pl-3 pb-3 h-full min-h-0 max-h-[38vh] lg:max-h-none">
            {routeListPanel}
          </div>
        )}

        <div className="order-1 lg:order-2 flex-1 min-w-0 min-h-0 flex flex-col">{mapArea}</div>

        {aiChatOpen && (
          <div className="order-3 shrink-0 h-full min-h-0 flex">
            <MapAIChatPanel onCollapse={() => setAiChatOpen(false)} />
          </div>
        )}
        {!aiChatOpen && <MapAICollapsedFab onOpen={() => setAiChatOpen(true)} />}
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row rounded-2xl overflow-hidden border border-surface-variant shadow-lg min-h-[520px] lg:min-h-[640px]">
      {mapArea}
      <div className="w-full lg:w-[340px] xl:w-[380px] border-t lg:border-t-0 lg:border-l border-surface-variant max-h-[360px] lg:max-h-none flex flex-col">
        {routeListPanel}
      </div>
    </div>
  );
}
