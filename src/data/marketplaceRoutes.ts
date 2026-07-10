import type { WaypointType } from '../types/route';
import { getCommunityImage } from './communityImages';
import { getCommunityByNo, getPoiById } from './phuketPois';
import { PROFILE_AVATAR } from './profileAvatar';

export type MarketplaceCategory = 'heritage' | 'food' | 'community' | 'nature' | 'family';

export interface MarketplaceWaypoint {
  name: string;
  lat: number;
  lng: number;
  description?: string;
  type?: WaypointType;
  imageUrl?: string;
}

export interface MarketplaceRoute {
  id: string;
  title: string;
  description: string;
  creator: { name: string; avatar: string; verified: boolean };
  price: number;
  rating: number;
  aiMatch: number;
  tags: string[];
  category: MarketplaceCategory;
  badge?: string;
  image: string;
  district: string;
  duration: string;
  stops: number;
  /** ค่ารถบริการต่อชั่วโมง (mockup — ทุกเส้นทางมีค่ารถ) */
  vehicleServicePerHour?: number;
  waypoints: MarketplaceWaypoint[];
  featured?: boolean;
  isNew?: boolean;
}

const CREATOR_AVATAR = PROFILE_AVATAR;

const CREATORS = [
  { name: 'สมชาย ใจดี', verified: true },
  { name: 'วิไล ถลาง', verified: true },
  { name: 'ประเสริฐ ทะเล', verified: true },
  { name: 'นภา กมลา', verified: true },
  { name: 'ฟาติมะ พันวา', verified: true },
  { name: 'อามีน บ่อแร่', verified: false },
  { name: 'สุรชัย ลิพอน', verified: true },
  { name: 'ดวงใจ ม่านิก', verified: true },
  { name: 'กานต์ รัษฎา', verified: true },
  { name: 'มณี บางโรง', verified: true },
  { name: 'ชัยพฤกษ์ มะพร้าว', verified: true },
  { name: 'ลัดดา ป่าตอง', verified: false },
  { name: 'วีระ สาคู', verified: true },
  { name: 'ปิยะ ขนุน', verified: true },
  { name: 'เบญจมาศ เคียน', verified: true },
  { name: 'ธนา บางเทา', verified: true },
  { name: 'สุภาพร ท่าฉัตร', verified: true },
  { name: 'อรุณี บางวาน', verified: true },
  { name: 'ชาญชัย เมืองเก่า', verified: true },
  { name: 'พิมพ์ใจ พันวา', verified: true },
] as const;

function creator(index: number) {
  const c = CREATORS[index % CREATORS.length];
  return { name: c.name, avatar: CREATOR_AVATAR, verified: c.verified };
}

function communityWp(
  no: number,
  type: WaypointType = 'activity',
  extraDesc?: string,
): MarketplaceWaypoint {
  const c = getCommunityByNo(no)!;
  return {
    name: c.name,
    lat: c.location.lat,
    lng: c.location.lng,
    type,
    description: extraDesc ?? c.hook,
    imageUrl: c.imageUrl,
  };
}

function poiWp(poiId: string, type: WaypointType): MarketplaceWaypoint {
  const p = getPoiById(poiId)!;
  return {
    name: p.name,
    lat: p.location.lat,
    lng: p.location.lng,
    type,
    description: p.hook,
    imageUrl: p.imageUrl,
  };
}

function communityLoc(no: number) {
  return getCommunityByNo(no)!.location;
}

/** จุดนัดพบ/รับจากโรงแรม — อาจอยู่ไกลจากชุมชนได้ */
function hotelMeeting(hotelId: string, label?: string): MarketplaceWaypoint {
  const h = getPoiById(hotelId)!;
  return {
    name: label ?? `จุดรับ — ${h.name}`,
    lat: h.location.lat,
    lng: h.location.lng,
    type: 'meeting',
    description: `นัดพบรับส่งจากโรงแรมพันธมิตร — ${h.hook}`,
  };
}

/** สถานที่ใกล้ชุมชน (จุดแวะและภายในรัศมีชุมชน) */
function nearCommunity(
  no: number,
  name: string,
  type: WaypointType,
  description: string,
  offset: { lat?: number; lng?: number } = {},
): MarketplaceWaypoint {
  const base = communityLoc(no);
  return {
    name,
    lat: base.lat + (offset.lat ?? 0),
    lng: base.lng + (offset.lng ?? 0),
    type,
    description,
  };
}

export const CATEGORY_META: Record<
  MarketplaceCategory,
  { label: string; color: string; bg: string }
> = {
  heritage: { label: 'มรดก', color: '#d97706', bg: '#fffbeb' },
  food: { label: 'อาหารท้องถิ่น', color: '#ea580c', bg: '#fff7ed' },
  community: { label: 'ชุมชน', color: '#16a34a', bg: '#f0fdf4' },
  nature: { label: 'ธรรมชาติ', color: '#0d9488', bg: '#f0fdfa' },
  family: { label: 'ครอบครัว', color: '#2563eb', bg: '#eff6ff' },
};

export const MARKETPLACE_ROUTES: MarketplaceRoute[] = [
  {
    id: '1',
    title: 'มรดกย่านเมืองเก่า · ชุมชนตลาดใหญ่',
    description:
      'เดินสัมผัสย่านเมืองเก่าสถาปัตยกรรมจีน-โปรตุกีส ชิมหมี่ฮกเกี้ยนตำนาน ตลาดคืนวันอาทิตย์ และศาลเจ้าใจกลางชุมชน',
    creator: creator(0),
    price: 7500,
    rating: 4.9,
    aiMatch: 98,
    tags: ['มรดก', 'เดินเที่ยว', 'เมืองเก่า', 'ครึ่งวัน'],
    category: 'heritage',
    featured: true,
    badge: 'แนะนำโรงแรม',
    image: getCommunityImage(4),
    district: 'ตลาดใหญ่, เมือง',
    duration: '5 ชม.',
    stops: 7,
    vehicleServicePerHour: 100,
    waypoints: [
      hotelMeeting('hotel-kamala-resort', 'จุดรับ — โรงแรมริมหาดกมลา'),
      communityWp(4, 'activity', 'เดินชมตึกชิโน-โปรตุกีสและถนนถลาง'),
      poiWp('landmark-onon-hotel', 'attraction'),
      poiWp('resto-mee-hokkien', 'restaurant'),
      nearCommunity(4, 'ตลาดใหญ่คืนวันอาทิตย์', 'shop', 'เดินชมของฝาก งานหัตถกรรม และสตรีทฟู้ดท้องถิ่น'),
      nearCommunity(4, 'ศาลเจ้าพ่อหลักเมือง', 'attraction', 'ศาลเจ้าศักดิ์สิทธิ์ใจกลางย่านเมืองเก่า', { lat: -0.001, lng: 0.001 }),
      nearCommunity(4, 'ถนนถลาง–ย่านสีสัน', 'end', 'เดินชมตึกเก่า คาเฟ่ และร้านของฝากก่อนจบทริป', { lat: -0.0005, lng: 0.0003 }),
    ],
  },
  {
    id: '2',
    title: 'ถลางโบราณ · ชุมชนบ้านขนุน',
    description:
      'หมู่บ้านโบราณยุคอยุธยา ชมโนราสด กินขนมโคจากเตาถ่าน และเรียนรู้ตำนานเก้าทัพกับชาวบ้าน',
    creator: creator(1),
    price: 6300,
    rating: 4.8,
    aiMatch: 94,
    tags: ['วัฒนธรรม', 'ครอบครัว', 'โนรา', 'ครึ่งวัน'],
    category: 'community',
    featured: true,
    badge: 'ชุมชนสนับสนุน',
    image: getCommunityImage(2),
    district: 'เทพกระษัตรี, ถลาง',
    duration: '5 ชม.',
    stops: 6,
    vehicleServicePerHour: 100,
    waypoints: [
      hotelMeeting('hotel-andamanda', 'จุดรับ — สวนน้ำเชิงทะเล'),
      communityWp(2, 'activity', 'ชมการรำโนราสดและเรื่องราวเก้าทัพ'),
      poiWp('resto-kanom-ko', 'restaurant'),
      nearCommunity(2, 'วัดขนุน', 'attraction', 'วัดเก่าแก่ใจกลางชุมชนบ้านขนุน', { lat: 0.002, lng: -0.001 }),
      nearCommunity(2, 'งานจักสานพื้นบ้าน', 'shop', 'ชมและเลือกซื้อผลิตภัณฑ์จักสานจากชาวบ้าน', { lat: -0.001, lng: 0.002 }),
      nearCommunity(2, 'ศูนย์เรียนรู้โนราถลาง', 'end', 'ฟังบรรยายประวัติโนราและถ่ายรูปกับนักแสดง', { lat: 0.001, lng: 0.001 }),
    ],
  },
  {
    id: '3',
    title: 'ทะเลเหนือ · ชุมชนท่าฉัตรไชย์',
    description:
      'ตำนานรักท้องถิ่นและทะเลสามป่า ชิมอาหารทะเลสดจากเรือประมง จับจิ้งหรีดทราย และชมป่าชายเลน',
    creator: creator(2),
    price: 5900,
    rating: 4.8,
    aiMatch: 93,
    tags: ['อาหาร', 'ทะเล', 'ธรรมชาติ', 'ครึ่งวัน'],
    category: 'food',
    featured: true,
    image: getCommunityImage(1),
    district: 'ไม้ขาว, ถลาง',
    duration: '5 ชม.',
    stops: 6,
    vehicleServicePerHour: 100,
    waypoints: [
      hotelMeeting('hotel-marriott-mai-khao', 'จุดรับ — รีสอร์ทหาดไม้ขาว'),
      communityWp(1, 'activity', 'สัมผัสวิถีชาวประมงและระบบนิเวศสามป่า'),
      poiWp('resto-seafood-thachatchai', 'restaurant'),
      nearCommunity(1, 'ชายหาดท่าฉัตรไชย์', 'attraction', 'เดินชายหาดและชมพระอาทิตย์ขึ้น', { lat: 0.001, lng: -0.001 }),
      nearCommunity(1, 'ฟาร์มกุ้งมังกรชุมชน', 'shop', 'ชมฟาร์มกุ้นและเลือกซื้ออาหารทะเลสด', { lat: -0.002, lng: 0.002 }),
      nearCommunity(1, 'ท่าเรือชุมชนท่าฉัตรไชย์', 'end', 'นั่งเรือชมป่าชายเลนกับไกด์ท้องถิ่น', { lng: -0.001 }),
    ],
  },
  {
    id: '4',
    title: 'OTOP ริมหาด · ชุมชนบ้านบางวาน',
    description:
      'ส้มควายและหัตถกรรม OTOP ชิมชาสมุนไพรจากสวนชุมชน และหาดกมลา ทำงานฝีมือกับชาวบ้าน',
    creator: creator(3),
    price: 5500,
    rating: 4.8,
    aiMatch: 92,
    tags: ['ครอบครัว', 'OTOP', 'ชายหาด', 'ครึ่งวัน'],
    category: 'family',
    isNew: true,
    badge: 'มาแรง',
    image: getCommunityImage(6),
    district: 'กมลา, กะทู้',
    duration: '4.5 ชม.',
    stops: 6,
    waypoints: [
      hotelMeeting('hotel-kamala-resort'),
      communityWp(6, 'activity', 'ทำงานฝีมือ OTOP และชมสวนส้มควาย'),
      poiWp('resto-bangwan-tea', 'restaurant'),
      poiWp('landmark-kamala', 'attraction'),
      nearCommunity(6, 'ร้านผลิตภัณฑ์ OTOP บางวาน', 'shop', 'เลือกซื้อชาสมุนไพร กระเป๋าบาติก และของฝากชุมชน', { lat: 0.001, lng: 0.001 }),
      nearCommunity(6, 'ลานชุมชนบ้านบางวาน', 'end', 'พักผ่อนริมหมู่บ้านก่อนกลับ', { lat: -0.001, lng: -0.001 }),
    ],
  },
  {
    id: '5',
    title: 'ปลายแหลมใต้ · ชุมชนแหลมพันวา',
    description:
      'หมู่บ้านประมงมุมใต้สุด ชิมอาหารทะเลริมอ่าว ชมพิพิธภัณฑ์สัตว์น้ำ และพระอาทิตย์ตกที่แหลมพรหมเทพ',
    creator: creator(4),
    price: 7300,
    rating: 4.9,
    aiMatch: 96,
    tags: ['ทะเล', 'ธรรมชาติ', 'ครอบครัว', 'ครึ่งวัน'],
    category: 'nature',
    image: getCommunityImage(7),
    district: 'วิชิต, เมือง',
    duration: '5 ชม.',
    stops: 6,
    vehicleServicePerHour: 100,
    waypoints: [
      hotelMeeting('landmark-wat-chalong', 'จุดรับ — วัดฉลอง (ฝั่งเมือง)'),
      communityWp(7, 'activity', 'สัมผัสวิถีชาวประมงและเรือหางยาว'),
      poiWp('landmark-aquarium', 'attraction'),
      poiWp('resto-phanwa-seafood', 'restaurant'),
      poiWp('landmark-promthep', 'attraction'),
      nearCommunity(7, 'จุดชมวิวแหลมพรหมเทพ', 'end', 'จุดจบสวยที่สุด — พระอาทิตย์ตกเหนือทะเลอันดามัน', { lat: -0.046, lng: -0.104 }),
    ],
  },
  {
    id: '6',
    title: 'ตลาดชุมชน · ตำบลรัษฎา',
    description:
      'ประตูสู่ฝั่งตะวันออก ชมตลาดผลไม้สด วิถีชาวสวน และทัศนียภาพอ่าวภูเก็ต',
    creator: creator(8),
    price: 5100,
    rating: 4.7,
    aiMatch: 90,
    tags: ['ตลาดชุมชน', 'ผลไม้', 'วิถีชาวบ้าน'],
    category: 'heritage',
    image: getCommunityImage(13),
    district: 'รัษฎา, เมือง',
    duration: '4 ชม.',
    stops: 5,
    waypoints: [
      hotelMeeting('landmark-wat-chalong'),
      communityWp(13, 'activity', 'เดินตลาดชุมชนและเรียนรู้วิถีเกษตรกร'),
      nearCommunity(13, 'ตลาดผลไม้รัษฎา', 'shop', 'ชิมผลไม้สดตามฤดูกาลจากสวนรอบอ่าว', { lat: 0.001, lng: 0.001 }),
      nearCommunity(13, 'สวนผลไม้ชุมชนรัษฎา', 'attraction', 'ชมสวนและเรียนรู้การปลูกผลไม้', { lat: -0.003, lng: 0.002 }),
      nearCommunity(13, 'จุดชมวิวอ่าวรัษฎา', 'end', 'มองทัศนียภาพอ่าวก่อนกลับ', { lat: 0.002, lng: -0.001 }),
    ],
  },
  {
    id: '7',
    title: 'เกาะมะพร้าว · ล็อบสเตอร์และวิถีชาวเกาะ',
    description:
      'นั่งเรือข้ามเกาะ กินล็อบสเตอร์ย่างสด ดำน้ำตื้น และเรียนรู้ชีวิตชาวประมงบนเกาะเล็ก',
    creator: creator(10),
    price: 6900,
    rating: 4.8,
    aiMatch: 94,
    tags: ['ทะเล', 'อาหาร', 'เกาะ', 'ครอบครัว'],
    category: 'food',
    featured: true,
    badge: 'ยอดนิยม',
    image: getCommunityImage(11),
    district: 'เกาะมะพร้าว, เมือง',
    duration: '5 ชม.',
    stops: 5,
    vehicleServicePerHour: 100,
    waypoints: [
      nearCommunity(11, 'ท่าเรือข้ามเกาะมะพร้าว', 'meeting', 'จุดนัดพบท่าเรือฝั่งดินก่อนข้ามเกาะ', { lat: 0.069, lng: 0.008 }),
      communityWp(11, 'activity', 'เดินชมหมู่บ้านชาวประมงบนเกาะ'),
      poiWp('resto-maphrao-lobster', 'restaurant'),
      nearCommunity(11, 'จุดดำน้ำตื้นเกาะมะพร้าว', 'attraction', 'ดูปะการังและปลาเล็กในน้ำใส', { lat: -0.001, lng: 0.001 }),
      nearCommunity(11, 'ฟาร์มกุ้นมังกรเกาะมะพร้าว', 'end', 'ชมฟาร์มกุ้นและชิมอาหารทะเลก่อนกลับ', { lat: 0.002, lng: -0.002 }),
    ],
  },
  {
    id: '8',
    title: 'ป่าชายเลน · ชุมชนบ้านบางโรง',
    description:
      'ล่องเรือชมป่าชายเลน ตลาดอาหารทะเลบางโรง และสัมผัสวิถีชาวประมงฝั่งตะวันออก',
    creator: creator(9),
    price: 4800,
    rating: 4.6,
    aiMatch: 88,
    tags: ['ธรรมชาติ', 'ทะเล', 'อีโค่ทัวร์'],
    category: 'nature',
    isNew: true,
    image: getCommunityImage(12),
    district: 'ป่าคลอก, ถลาง',
    duration: '4 ชม.',
    stops: 5,
    vehicleServicePerHour: 100,
    waypoints: [
      hotelMeeting('landmark-wat-chalong'),
      communityWp(12, 'activity', 'เดินตลาดชุมชนและเรียนรู้วิถีชาวประมง'),
      nearCommunity(12, 'ล่องเรือป่าชายเลน', 'attraction', 'ชมระบบนิเวศป่าชายเลนกับไกด์ท้องถิ่น', { lat: -0.003, lng: -0.002 }),
      poiWp('resto-bangrong-market', 'restaurant'),
      nearCommunity(12, 'ท่าเรือบ้านบางโรง', 'end', 'จุดจบริมท่าเรือ ชมวิวอ่าวภูเก็ต', { lat: -0.001, lng: -0.001 }),
    ],
  },
  {
    id: '9',
    title: 'ป่าตองลึกซึ้ง · ชุมชนหลังซอย',
    description:
      'ค้นพบป่าตองที่คนท้องถิ่นรู้จัก สตรีทฟู้ดหลังซอย ชมหาดป่าตอง และงานศิลปะชุมชน',
    creator: creator(11),
    price: 4500,
    rating: 4.5,
    aiMatch: 86,
    tags: ['สตรีทฟู้ด', 'ชายหาด', 'งบประหยัด'],
    category: 'family',
    image: getCommunityImage(14),
    district: 'ป่าตอง, กะทู้',
    duration: '4 ชม.',
    stops: 5,
    waypoints: [
      hotelMeeting('hotel-andamanda'),
      communityWp(14, 'activity', 'เดินชมชุมชนหลังซอยที่นักท่องเที่ยวไม่ค่อยรู้'),
      poiWp('resto-patong-street', 'restaurant'),
      poiWp('landmark-patong-beach', 'attraction'),
      nearCommunity(14, 'ลานศิลปะชุมชนป่าตอง', 'end', 'ชมงานศิลปะและของฝากจากชาวบ้าน', { lat: 0.001, lng: -0.001 }),
    ],
  },
  {
    id: '10',
    title: 'มัดย้อมผ้า · ชุมชนบ้านเคียน',
    description:
      'ศูนย์กลางวัฒนธรรมถลาง มัดย้อมผ้าเปลือกมังคุด กินข้าวหลามเผา และชมกระบี่กระบอง',
    creator: creator(16),
    price: 5600,
    rating: 4.7,
    aiMatch: 91,
    tags: ['วัฒนธรรม', 'หัตถกรรม', 'ข้าวหลาม'],
    category: 'community',
    image: getCommunityImage(3),
    district: 'เทพกระษัตรี, ถลาง',
    duration: '4.5 ชม.',
    stops: 6,
    waypoints: [
      hotelMeeting('hotel-andamanda'),
      communityWp(3, 'activity', 'เวิร์กช็อปมัดย้อมผ้าและพับดอกบัวกับชาวบ้าน'),
      poiWp('resto-khao-lum-khian', 'restaurant'),
      nearCommunity(3, 'เรือนไม้โบราณบ้านเคียน', 'attraction', 'ถ่ายรูปเรือนไม้เก่าและเรียนรู้ประวัติชุมชน', { lat: 0.001, lng: -0.001 }),
      nearCommunity(3, 'ร้านขนมไทยชุมชนเคียน', 'shop', 'ชิมขนมไทยโบราณและน้ำสมุนไพร', { lat: -0.001, lng: 0.002 }),
      nearCommunity(3, 'ศูนย์บริการนักท่องเที่ยวบ้านเคียน', 'end', 'รวบรวมของฝากและพักก่อนกลับ', { lng: 0.001 }),
    ],
  },
  {
    id: '11',
    title: 'มัสยิดใจกลางเมือง · ชุมชนบ่อแร่',
    description:
      'ค้นพบวิถีมุสลิมอันสงบ มัสยิดกียามุดดีน ชิมข้าวหมกไก่ฮาลาล และเวิร์กช็อปมัดย้อม',
    creator: creator(5),
    price: 4100,
    rating: 4.6,
    aiMatch: 87,
    tags: ['ฮาลาล', 'วัฒนธรรม', 'งบประหยัด'],
    category: 'heritage',
    image: getCommunityImage(5),
    district: 'วิชิต, เมือง',
    duration: '3.5 ชม.',
    stops: 5,
    waypoints: [
      hotelMeeting('landmark-wat-chalong'),
      communityWp(5, 'activity', 'เรียนรู้วิถีมุสลิมและชมมัสยิดกียามุดดีน'),
      poiWp('resto-halal-borrae', 'restaurant'),
      nearCommunity(5, 'ฟาร์มผึ้งชั่นโรจน์', 'attraction', 'ชมการเลี้ยงผึ้งชันของชุมชน', { lat: 0.002, lng: 0.001 }),
      nearCommunity(5, 'ร้านจักสานบ้านบ่อแร่', 'end', 'เลือกซื้องานจักสานและผลิตภัณฑ์มัดย้อม', { lat: -0.001, lng: -0.001 }),
    ],
  },
  {
    id: '12',
    title: 'ข้าวยำสูตรต้นตำรับ · ชุมชนบ้านบางเทา',
    description:
      'ชุมชนพุทธ-มุสลิมอยู่ร่วมกัน ทำข้าวยำใบหูหวาน ชมตลาดปลาสด และเดินชมสวนชุมชน',
    creator: creator(15),
    price: 5300,
    rating: 4.7,
    aiMatch: 89,
    tags: ['อาหาร', 'ตลาดปลา', 'วัฒนธรรม'],
    category: 'family',
    image: getCommunityImage(9),
    district: 'เชิงทะเล, ถลาง',
    duration: '4.5 ชม.',
    stops: 5,
    vehicleServicePerHour: 100,
    waypoints: [
      hotelMeeting('hotel-andamanda'),
      communityWp(9, 'activity', 'เรียนรู้วัฒนธรรมอยู่ร่วมสองศาสนาในชุมชน'),
      poiWp('resto-bangtao-yam', 'restaurant'),
      nearCommunity(9, 'ตลาดปลาสดบ้านบางเทา', 'shop', 'เลือกอาหารทะเลสดจากชาวประมง', { lat: 0.001, lng: -0.001 }),
      nearCommunity(9, 'สวนเกษตรอินทรีย์บางเทา', 'end', 'ชมสวนชุมชนและผลผลิตท้องถิ่น', { lat: -0.002, lng: 0.001 }),
    ],
  },
  {
    id: '13',
    title: 'หนังตะลุงสด · ชุมชนบ้านลิพอน',
    description:
      'บ้านเกิดหนังตะลุงภูเก็ต ชมการแสดงสด แกะหนัง และลิ้มรสปลาต้าสูตรโบราณ',
    creator: creator(6),
    price: 5000,
    rating: 4.8,
    aiMatch: 92,
    tags: ['ศิลปะ', 'หนังตะลุง', 'วัฒนธรรม'],
    category: 'community',
    badge: 'วัฒนธรรม',
    image: getCommunityImage(8),
    district: 'ศรีสุนทร, ถลาง',
    duration: '4.5 ชม.',
    stops: 5,
    waypoints: [
      hotelMeeting('hotel-andamanda'),
      communityWp(8, 'activity', 'ชมการแสดงหนังตะลุงสดและเรื่องราวหนังลุงภูเก็ต'),
      poiWp('resto-pla-ta-lipon', 'restaurant'),
      nearCommunity(8, 'โรงละครหนังตะลุงบ้านลิพอน', 'attraction', 'สาธิตแกะหนังและถ่ายรูปกับนักแสดง', { lat: 0.001, lng: 0.001 }),
      nearCommunity(8, 'ศาลาชุมชนบ้านลิพอน', 'end', 'พักผ่อนและชมงานศิลปะพื้นบ้าน', { lat: -0.001, lng: -0.001 }),
    ],
  },
  {
    id: '14',
    title: 'ฟาร์มออร์แกนิก · ชุมชนบ้านม่านิก',
    description:
      'หมู่บ้านเศรษฐกิจพอเพียง เวิร์กช็อปสมุนไพร กรีดยาง และสกินแคร์ออร์แกนิกจากกระเจี๊ยบ',
    creator: creator(7),
    price: 3900,
    rating: 4.5,
    aiMatch: 85,
    tags: ['ออร์แกนิก', 'เวิร์กช็อป', 'พอเพียง'],
    category: 'nature',
    isNew: true,
    image: getCommunityImage(10),
    district: 'ศรีสุนทร, ถลาง',
    duration: '4 ชม.',
    stops: 5,
    waypoints: [
      hotelMeeting('hotel-andamanda'),
      communityWp(10, 'activity', 'เวิร์กช็อปสมุนไพรและชมการกรีดยาง'),
      poiWp('resto-manik-herbal', 'restaurant'),
      nearCommunity(10, 'สวนสมุนไพรชุมชนม่านิก', 'attraction', 'เก็บใบสมุนไพรและชงชาดื่มริมศาลา', { lat: 0.001, lng: -0.001 }),
      nearCommunity(10, 'ร้านสกินแคร์ออร์แกนิกม่านิก', 'end', 'เลือกซื้อผลิตภัณฑ์สมุนไพรจากชุมชน', { lat: -0.001, lng: 0.002 }),
    ],
  },
  {
    id: '15',
    title: 'เรือหางยาว · ชุมชนแหลมพันวา (รอบอ่าว)',
    description:
      'นั่งเรือหางยาวกับชาวประมง ชิมข้าวยำและผัดหมี่โบราณ ชมกิจกรรมทางวัฒนธรรมอิสลาม',
    creator: creator(19),
    price: 6400,
    rating: 4.7,
    aiMatch: 90,
    tags: ['ทะเล', 'เรือหางยาว', 'ครอบครัว'],
    category: 'nature',
    image: getCommunityImage(7),
    district: 'วิชิต, เมือง',
    duration: '4.5 ชม.',
    stops: 5,
    vehicleServicePerHour: 100,
    waypoints: [
      hotelMeeting('landmark-bigbuddha', 'จุดรับ — พระใหญ่ภูเก็ต'),
      communityWp(7, 'activity', 'นั่งเรือหางยาวและเรียนรู้แผนโบราณ'),
      poiWp('resto-phanwa-seafood', 'restaurant'),
      nearCommunity(7, 'ลานแสดงกลองและระบายอิสลาม', 'attraction', 'ชมศิลปวัฒนธรรมชุมชนแหลมพันวา', { lat: 0.001, lng: 0.002 }),
      poiWp('landmark-promthep', 'end'),
    ],
  },
  {
    id: '16',
    title: 'เช้าเหนือ · ชุมชนบ้านสาคู',
    description:
      'หมู่บ้านเหนือสุดใกล้สนามบิน อาหารเช้าพื้นบ้าน ชมวัดท้องถิ่น และเดินชมหมู่บ้านชานเมือง',
    creator: creator(12),
    price: 4600,
    rating: 4.6,
    aiMatch: 88,
    tags: ['อาหารเช้า', 'ชานเมือง', 'วัดท้องถิ่น'],
    category: 'food',
    image: getCommunityImage(15),
    district: 'สาคู, ถลาง',
    duration: '3.5 ชม.',
    stops: 5,
    waypoints: [
      hotelMeeting('hotel-marriott-mai-khao'),
      communityWp(15, 'activity', 'เดินชมหมู่บ้านและเรียนรู้ประวัติชุมชน'),
      poiWp('resto-sakhu-local', 'restaurant'),
      nearCommunity(15, 'วัดท้องถิ่นบ้านสาคู', 'attraction', 'ชมสถาปัตยกรรมวัดและบรรยากาศชาวบ้าน', { lat: -0.002, lng: 0.001 }),
      nearCommunity(15, 'ตลาดชุมชนบ้านสาคู', 'end', 'เลือกซื้อขนมพื้นบ้านและกาแฟชุมชน', { lat: 0.001, lng: -0.001 }),
    ],
  },
  {
    id: '17',
    title: 'เมืองเก่าเต็มรส · ชุมชนตลาดใหญ่ (เจาะลึก)',
    description:
      'เส้นทางเจาะลึกย่านเมืองเก่า ตลาดคืนวันอาทิตย์ On On Hotel และศาลเจ้าใจกลางชุมชน',
    creator: creator(18),
    price: 7100,
    rating: 4.9,
    aiMatch: 97,
    tags: ['มรดก', 'เดินเที่ยว', 'ถ่ายรูป'],
    category: 'heritage',
    featured: true,
    badge: 'แนะนำโรงแรม',
    image: getCommunityImage(4),
    district: 'ตลาดใหญ่, เมือง',
    duration: '5.5 ชม.',
    stops: 6,
    vehicleServicePerHour: 100,
    waypoints: [
      hotelMeeting('landmark-wat-chalong'),
      communityWp(4, 'activity', 'เดินสำรวจย่านมรดกโลกกับไกด์ท้องถิ่น'),
      poiWp('landmark-onon-hotel', 'attraction'),
      poiWp('resto-mee-hokkien', 'restaurant'),
      nearCommunity(4, 'ตลาดใหญ่คืนวันอาทิตย์', 'shop', 'สตรีทฟู้ดและของฝากท้องถิ่น'),
      nearCommunity(4, 'ศาลเจ้าพ่อหลักเมือง', 'end', 'ขอพรและจบทริปใจกลางเมืองเก่า', { lat: -0.001, lng: 0.001 }),
    ],
  },
  {
    id: '18',
    title: 'หัตถกรรมถลาง · ชุมชนบ้านเคียน (คราฟต์)',
    description:
      'มัดย้อมผ้า ข้าวหลามเผา ชมอนุสรณ์วีรสตรีเก้าทัพ และงานหัตถกรรมชุมชน',
    creator: creator(14),
    price: 5400,
    rating: 4.7,
    aiMatch: 89,
    tags: ['หัตถกรรม', 'ครอบครัว', 'เวิร์กช็อป'],
    category: 'community',
    image: getCommunityImage(3),
    district: 'เทพกระษัตรี, ถลาง',
    duration: '4.5 ชม.',
    stops: 5,
    waypoints: [
      hotelMeeting('hotel-andamanda'),
      communityWp(3, 'activity', 'มัดย้อมผ้าเปลือกมังคุดกับชาวบ้าน'),
      poiWp('resto-khao-lum-khian', 'restaurant'),
      nearCommunity(3, 'อนุสรณ์วีรสตรีเก้าทัพ', 'attraction', 'เรียนรู้เรื่องราววีรสตรีในประวัติศาสตร์ถลาง', { lat: 0.002, lng: 0.001 }),
      nearCommunity(3, 'ร้านหัตถกรรมบ้านเคียน', 'end', 'เลือกซื้อผ้ามัดย้อมและของที่ระลึก', { lat: -0.001, lng: -0.002 }),
    ],
  },
  {
    id: '19',
    title: 'อีโค่ทัวร์ · ชุมชนบ้านบางโรง (เช้า)',
    description:
      'ตลาดเช้าบางโรง ล่องเรือป่าชายเลน ปล่อยปูเพื่อฟื้นฟูธรรมชาติ และอาหารทะเลชาวบ้าน',
    creator: creator(8),
    price: 7800,
    rating: 4.8,
    aiMatch: 93,
    tags: ['อีโค่ทัวร์', 'ป่าชายเลน', 'ตลาดเช้า'],
    category: 'nature',
    badge: 'อีโค่ทัวร์',
    image: getCommunityImage(12),
    district: 'ป่าคลอก, ถลาง',
    duration: '5 ชม.',
    stops: 6,
    vehicleServicePerHour: 100,
    waypoints: [
      hotelMeeting('landmark-wat-chalong'),
      communityWp(12, 'activity', 'ตื่นเช้าที่ตลาดชุมชนบ้านบางโรง'),
      nearCommunity(12, 'ตลาดเช้าบ้านบางโรง', 'shop', 'เลือกอาหารทะเลสดและขนมจีนชาวบ้าน', { lat: 0.001, lng: 0.001 }),
      nearCommunity(12, 'ล่องเรือป่าชายเลน', 'attraction', 'ชมระบบนิเวศและปล่อยปูคืนธรรมชาติ', { lat: -0.003, lng: -0.002 }),
      poiWp('resto-bangrong-market', 'restaurant'),
      nearCommunity(12, 'ท่าเรือชุมชนบางโรง', 'end', 'จุดจบริมท่าเรือพร้อมกาแฟโบราณ', { lat: -0.001, lng: -0.001 }),
    ],
  },
  {
    id: '20',
    title: 'ไฮไลท์เหนือ · ชุมชนท่าฉัตรไชย์ (พรีเมียม)',
    description:
      'เส้นทางพรีเมียมรอบชุมชนท่าฉัตรไชย์ — อาหารทะเล ป่าชายเลน บาติก และวาดผ้ากับชาวบ้าน',
    creator: creator(0),
    price: 8400,
    rating: 4.9,
    aiMatch: 99,
    tags: ['พรีเมียม', 'ทะเล', 'หัตถกรรม', 'เต็มวัน'],
    category: 'heritage',
    featured: true,
    badge: 'พิเศษสุด',
    image: getCommunityImage(1),
    district: 'ไม้ขาว, ถลาง',
    duration: '6 ชม.',
    stops: 7,
    vehicleServicePerHour: 100,
    waypoints: [
      hotelMeeting('hotel-marriott-mai-khao'),
      communityWp(1, 'activity', 'วาดผ้าบาติกและจับจิ้งหรีดทรายกับชาวบ้าน'),
      poiWp('resto-seafood-thachatchai', 'restaurant'),
      nearCommunity(1, 'นั่งเรือชมฟาร์มกุ้งมังกร', 'attraction', 'เรียนรู้การเลี้ยงกุ้งของชุมชน', { lat: -0.002, lng: 0.003 }),
      nearCommunity(1, 'เดินป่าชายเลนท้องถิ่น', 'attraction', 'ชมระบบนิเวศสามป่ากับไกด์ชาวบ้าน', { lat: 0.001, lng: -0.002 }),
      nearCommunity(1, 'ร้านของฝากชุมชนท่าฉัตรไชย์', 'shop', 'เลือกซื้อผ้าบาติกและของที่ระลึก', { lat: -0.001, lng: 0.001 }),
      nearCommunity(1, 'ชายหาดท่าฉัตรไชย์', 'end', 'พักผ่อนริมทะเลก่อนกลับ', { lat: 0.001, lng: -0.001 }),
    ],
  }];

export function formatPrice(price: number) {
  return `฿${price.toLocaleString('th-TH')}`;
}

export function getRouteCenter(route: MarketplaceRoute) {
  const pts = route.waypoints;
  if (pts.length === 0) return { lat: 7.95, lng: 98.35 };
  const lat = pts.reduce((s, p) => s + p.lat, 0) / pts.length;
  const lng = pts.reduce((s, p) => s + p.lng, 0) / pts.length;
  return { lat, lng };
}

export function getRoutePath(route: MarketplaceRoute): [number, number][] {
  return route.waypoints.map((w) => [w.lat, w.lng]);
}
