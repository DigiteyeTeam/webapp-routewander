export type OsrmLatLng = { lat: number; lng: number };

type OsrmProfile = 'foot' | 'driving';

function geoJsonToLeaflet(coords: [number, number][]): [number, number][] {
  return coords.map(([lng, lat]) => [lat, lng]);
}

async function fetchOsrmLeg(
  from: OsrmLatLng,
  to: OsrmLatLng,
  profile: OsrmProfile,
): Promise<[number, number][]> {
  const url = `https://router.project-osrm.org/route/v1/${profile}/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('OSRM leg failed');
  const data = await res.json();
  if (data.code !== 'Ok' || !data.routes?.length) {
    throw new Error('OSRM no route');
  }
  return geoJsonToLeaflet(data.routes[0].geometry.coordinates);
}

/** ดึงเส้นทางตามถนน/ทางเดิน ทีละช่วงระหว่างจุด */
export async function fetchOsrmRoutePath(
  points: OsrmLatLng[],
  profile: OsrmProfile = 'foot',
): Promise<[number, number][]> {
  if (points.length < 2) {
    return points.map((p) => [p.lat, p.lng]);
  }

  const merged: [number, number][] = [];

  for (let i = 0; i < points.length - 1; i++) {
    const from = points[i];
    const to = points[i + 1];

    try {
      const leg = await fetchOsrmLeg(from, to, profile);
      if (merged.length > 0) {
        merged.push(...leg.slice(1));
      } else {
        merged.push(...leg);
      }
    } catch {
      if (merged.length === 0) {
        merged.push([from.lat, from.lng]);
      }
      merged.push([to.lat, to.lng]);
    }
  }

  return merged;
}

/** คำขอเดียวครบทุกจุด (ใช้กับเส้นทางสั้น) */
export async function fetchOsrmRoutePathSingle(
  points: OsrmLatLng[],
  profile: OsrmProfile = 'foot',
): Promise<[number, number][]> {
  if (points.length < 2) {
    return points.map((p) => [p.lat, p.lng]);
  }

  const coordinates = points.map((p) => `${p.lng},${p.lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/${profile}/${coordinates}?overview=full&geometries=geojson`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('OSRM failed');
  const data = await res.json();
  if (data.code !== 'Ok' || !data.routes?.length) {
    throw new Error('OSRM no route');
  }
  return geoJsonToLeaflet(data.routes[0].geometry.coordinates);
}
