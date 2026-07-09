import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { RouteWaypoint } from '../../types/route';
import { getRouteCenter } from '../../data/routeStore';
import { fetchOsrmRoutePathSingle } from '../../utils/osrmRoute';

L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.9.4/dist/images/';

function createNumberedIcon(index: number) {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.2));">
        <div style="
          background:#16a34a;color:white;font-size:12px;font-weight:bold;
          border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;
          border:2.5px solid white;
        ">${index + 1}</div>
        <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid #16a34a;margin-top:-2px;"></div>
      </div>
    `,
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    popupAnchor: [0, -34],
  });
}

function MapResizeFix() {
  const map = useMap();
  useEffect(() => {
    const invalidate = () => map.invalidateSize({ animate: false });
    const raf = requestAnimationFrame(invalidate);
    const t = window.setTimeout(invalidate, 200);
    window.addEventListener('resize', invalidate);
    const el = map.getContainer().parentElement;
    const ro = el ? new ResizeObserver(() => requestAnimationFrame(invalidate)) : null;
    if (el) ro?.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
      window.removeEventListener('resize', invalidate);
      ro?.disconnect();
    };
  }, [map]);
  return null;
}

function MapFocus({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([center.lat, center.lng], zoom, { duration: 0.5 });
  }, [center, zoom, map]);
  return null;
}

export default function RouteDetailMap({ waypoints, color = '#16a34a' }: { waypoints: RouteWaypoint[]; color?: string }) {
  const center = useMemo(() => getRouteCenter(waypoints), [waypoints]);
  const [routePath, setRoutePath] = useState<[number, number][]>([]);

  useEffect(() => {
    if (waypoints.length < 2) {
      setRoutePath(waypoints.map((w) => [w.location.lat, w.location.lng]));
      return;
    }

    let cancelled = false;
    const points = waypoints.map((wp) => wp.location);

    fetchOsrmRoutePathSingle(points, 'foot')
      .then((path) => {
        if (!cancelled) setRoutePath(path);
      })
      .catch(() => {
        if (!cancelled) {
          setRoutePath(waypoints.map((w) => [w.location.lat, w.location.lng]));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [waypoints]);

  const zoom = waypoints.length <= 1 ? 14 : waypoints.length <= 3 ? 13 : 12;

  return (
    <div className="relative w-full h-[320px] md:h-[420px] rounded-2xl overflow-hidden border border-surface-variant shadow-sm">
      <div className="absolute inset-0">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={zoom}
          minZoom={10}
          style={{ width: '100%', height: '100%' }}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapResizeFix />
          <MapFocus center={center} zoom={zoom} />

          {routePath.length > 1 && (
            <Polyline positions={routePath} pathOptions={{ color, weight: 4, opacity: 0.85 }} />
          )}

          {waypoints.map((wp, i) => (
            <Marker
              key={wp.id}
              position={[wp.location.lat, wp.location.lng]}
              icon={createNumberedIcon(i)}
              zIndexOffset={300 + i}
            >
              <Popup>
                <div className="min-w-[180px]">
                  <p className="text-[10px] font-bold text-secondary mb-0.5">จุดที่ {i + 1}</p>
                  <p className="font-bold text-sm">{wp.name}</p>
                  {wp.description && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{wp.description}</p>}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
