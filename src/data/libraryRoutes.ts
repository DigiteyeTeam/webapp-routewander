import {
  MARKETPLACE_ROUTES,
  type MarketplaceRoute,
} from './marketplaceRoutes';

export type LibraryLicenseKind = 'lifetime' | 'monthly' | 'annual' | 'custom';

export interface LibraryEntry {
  id: string;
  sourceRouteId: string;
  license: LibraryLicenseKind;
  displayTitle?: string;
  displayDescription?: string;
  forkedFromTitle?: string;
  annualRenewal?: string;
}

/** เส้นทางที่ผู้ใช้มีไลเซนส์แล้ว — อ้างอิงจากตลาดเส้นทาง RouteWander */
export const LIBRARY_ENTRIES: LibraryEntry[] = [
  {
    id: '1',
    sourceRouteId: '1',
    license: 'lifetime',
  },
  {
    id: '2',
    sourceRouteId: '2',
    license: 'monthly',
    annualRenewal: 'ต่ออายุทุกเดือน',
  },
  {
    id: '3',
    sourceRouteId: '1',
    license: 'custom',
    displayTitle: 'มรดกเมืองเก่า (เวอร์ชัน VIP โรงแรม)',
    displayDescription:
      'เวอร์ชันปรับแต่งจากเส้นทางมรดกเมืองเก่า สำหรับแขก VIP พร้อมจุดแวะพิเศษ',
    forkedFromTitle: 'มรดกเมืองเก่า · จากถนนถลางสู่บ้านบ่อแร่',
  },
];

export function getLibraryEntry(id: string): LibraryEntry | undefined {
  return LIBRARY_ENTRIES.find((e) => e.id === id);
}

export function resolveLibrarySourceRoute(entry: LibraryEntry): MarketplaceRoute | undefined {
  return MARKETPLACE_ROUTES.find((r) => r.id === entry.sourceRouteId);
}

export function getLibraryDisplayTitle(
  entry: LibraryEntry,
  source: MarketplaceRoute,
): string {
  return entry.displayTitle ?? source.title;
}

export function getLibraryDisplayDescription(
  entry: LibraryEntry,
  source: MarketplaceRoute,
): string {
  return entry.displayDescription ?? source.description;
}
