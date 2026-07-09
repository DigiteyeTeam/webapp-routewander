import { useEffect, useState } from 'react';
import { Polyline } from 'react-leaflet';
import { fetchOsrmRoutePath, type OsrmLatLng } from '../../utils/osrmRoute';

interface OsrmRoutePolylineProps {
  waypoints: OsrmLatLng[];
  visible: boolean;
  color?: string;
  weight?: number;
  opacity?: number;
}

export default function OsrmRoutePolyline({
  waypoints,
  visible,
  color = '#0d9488',
  weight = 4,
  opacity = 0.85,
}: OsrmRoutePolylineProps) {
  const [path, setPath] = useState<[number, number][]>([]);

  const waypointsKey = waypoints.map((w) => `${w.lat},${w.lng}`).join('|');

  useEffect(() => {
    if (!visible || waypoints.length < 2) {
      setPath([]);
      return;
    }

    let cancelled = false;

    void fetchOsrmRoutePath(waypoints, 'foot')
      .then((routed) => {
        if (!cancelled) setPath(routed);
      })
      .catch(() => {
        if (!cancelled) {
          setPath(waypoints.map((w) => [w.lat, w.lng]));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [waypointsKey, visible, waypoints]);

  if (!visible || path.length < 2) return null;

  return (
    <Polyline
      positions={path}
      pathOptions={{
        color,
        weight,
        opacity,
        lineCap: 'round',
        lineJoin: 'round',
      }}
    />
  );
}
