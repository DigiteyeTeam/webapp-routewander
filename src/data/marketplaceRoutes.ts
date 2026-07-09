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

function wps(...items: MarketplaceWaypoint[]) {
  return items;
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
    title: 'มรดกเมืองเก่า · จากถนนถลางสู่บ้านบ่อแร่',
    description:
      'เดินสัมผัสย่านเมืองเก่าสถาปัตยกรรมจีน-โปรตุกีส ชิมหมี่ฮกเกี้ยนตำนาน แล้วต่อด้วยวิถีมุสลิมอันสงบที่บ้านบ่อแร่',
    creator: creator(0),
    price: 7500,
    rating: 4.9,
    aiMatch: 98,
    tags: ['มรดก', 'เดินเที่ยว', 'ฮาลาล', 'ครึ่งวัน'],
    category: 'heritage',
    badge: 'แนะนำโรงแรม',
    image: getCommunityImage(4),
    district: 'เมืองภูเก็ต',
    duration: '5 ชม.',
    stops: 8,
    featured: true,
    waypoints: [
      communityWp(4, 'meeting', 'จุดเริ่มต้น ณ ย่านเมืองเก่า — ตึกชิโน-โปรตุกีสและตลาดคืนวันอาทิตย์'),
      poiWp('resto-mee-hokkien', 'restaurant'),
      poiWp('landmark-onon-hotel', 'attraction'),
      { name: 'ตลาดใหญ่คืนวันอาทิตย์', lat: 7.8862, lng: 98.3888, type: 'shop', description: 'เดินชมของฝาก งานหัตถกรรม และสตรีทฟู้ดท้องถิ่น' },
      { name: 'ศาลเจ้าพ่อหลักเมือง', lat: 7.8835, lng: 98.3908, type: 'attraction', description: 'ศาลเจ้าศักดิ์สิทธิ์ใจกลางย่านเมืองเก่า' },
      communityWp(5, 'activity', 'ค้นพบมัสยิดกียามุดดีนและวิถีมุสลิมอันสงบ'),
      poiWp('resto-halal-borrae', 'restaurant'),
      poiWp('landmark-wat-chalong', 'end'),
    ],
  },
  {
    id: '2',
    title: 'ถลางวัฒนธรรม · โนรา หนังตะลุง และสมุนไพร',
    description:
      'จากบ้านขนุนสู่บ้านเคียน ชมโนราสด กินข้าวหลามเผา ต่อด้วยหนังตะลุงบ้านลิพอน และปิดท้ายเวิร์กช็อปสมุนไพรบ้านม่านิก',
    creator: creator(1),
    price: 6300,
    rating: 4.8,
    aiMatch: 94,
    tags: ['วัฒนธรรม', 'ครอบครัว', 'ศิลปะ', 'ครึ่งวัน'],
    category: 'community',
    badge: 'ชุมชนสนับสนุน',
    image: getCommunityImage(2),
    district: 'ถลาง',
    duration: '6 ชม.',
    stops: 8,
    featured: true,
    waypoints: [
      communityWp(2, 'meeting'),
      poiWp('resto-kanom-ko', 'restaurant'),
      communityWp(3, 'activity'),
      poiWp('resto-khao-lum-khian', 'restaurant'),
      communityWp(8, 'activity', 'ชมหนังตะลุงสดและเรื่องราวหนังลุงภูเก็ต'),
      poiWp('resto-pla-ta-lipon', 'restaurant'),
      communityWp(10, 'activity'),
      poiWp('resto-manik-herbal', 'end'),
    ],
  },
  {
    id: '3',
    title: 'ทะเลเหนือ · ท่าฉัตรไชย์ สาคู และบางโรง',
    description:
      'เริ่มจากชุมชนประมงท่าฉัตรไชย์ ชิมอาหารทะเลสด ต่อด้วยบ้านสาคูและตลาดบางโรง ป่าชายเลนและวิถีชาวประมงภูเก็ตเหนือ',
    creator: creator(2),
    price: 5900,
    rating: 4.8,
    aiMatch: 93,
    tags: ['อาหาร', 'ทะเล', 'ธรรมชาติ', 'ครึ่งวัน'],
    category: 'food',
    image: getCommunityImage(1),
    district: 'ถลางเหนือ',
    duration: '5 ชม.',
    stops: 7,
    featured: true,
    waypoints: [
      communityWp(1, 'meeting'),
      poiWp('resto-seafood-thachatchai', 'restaurant'),
      communityWp(15, 'activity', 'สัมผัสวิถีชาวบ้านเหนือสุดใกล้สนามบิน'),
      poiWp('resto-sakhu-local', 'restaurant'),
      communityWp(12, 'activity', 'ล่องเรือชมป่าชายเลนและตลาดชุมชน'),
      poiWp('resto-bangrong-market', 'restaurant'),
      { name: 'ท่าเรือบ้านบางโรง', lat: 8.067, lng: 98.417, type: 'end', description: 'จุดจบริมท่าเรือ — ชมพระอาทิตย์ตกกลับภูเก็ต' },
    ],
  },
  {
    id: '4',
    title: 'ชายหาดตะวันตก · กมลา บางวาน และบางเทา',
    description:
      'OTOP ส้มควายที่บ้านบางวาน แวะหาดกมลา ต่อด้วยข้าวยำบ้านบางเทา และสำรวจชุมชนหลังซอยป่าตองที่นักท่องเที่ยวไม่ค่อยรู้',
    creator: creator(3),
    price: 5500,
    rating: 4.8,
    aiMatch: 92,
    tags: ['ครอบครัว', 'OTOP', 'ชายหาด', 'สตรีทฟู้ด'],
    category: 'family',
    badge: 'มาแรง',
    image: getCommunityImage(6),
    district: 'กะทู้–ถลาง',
    duration: '5 ชม.',
    stops: 7,
    isNew: true,
    waypoints: [
      communityWp(6, 'meeting'),
      poiWp('resto-bangwan-tea', 'restaurant'),
      poiWp('landmark-kamala', 'attraction'),
      communityWp(9, 'activity'),
      poiWp('resto-bangtao-yam', 'restaurant'),
      communityWp(14, 'activity', 'ค้นพบชุมชนจริงหลังซอยป่าตอง'),
      poiWp('resto-patong-street', 'end'),
    ],
  },
  {
    id: '5',
    title: 'ปลายแหลมใต้ · พันวา เกาะมะพร้าว และพรหมเทพ',
    description:
      'หมู่บ้านประมงแหลมพันวา พิพิธภัณฑ์สัตว์น้ำ นั่งเรือไปเกาะมะพร้าวกินล็อบสเตอร์ ปิดท้ายชมพระอาทิตย์ตกที่แหลมพรหมเทพ',
    creator: creator(4),
    price: 7300,
    rating: 4.9,
    aiMatch: 96,
    tags: ['ทะเล', 'ธรรมชาติ', 'ครอบครัว', 'ครึ่งวัน'],
    category: 'nature',
    image: getCommunityImage(7),
    district: 'เมืองภูเก็ต',
    duration: '6 ชม.',
    stops: 7,
    waypoints: [
      communityWp(7, 'meeting'),
      poiWp('landmark-aquarium', 'attraction'),
      poiWp('resto-phanwa-seafood', 'restaurant'),
      communityWp(11, 'activity', 'นั่งเรือข้ามเกาะ ดำน้ำตื้น และสัมผัสวิถีชาวเกาะ'),
      poiWp('resto-maphrao-lobster', 'restaurant'),
      poiWp('landmark-promthep', 'attraction'),
      { name: 'จุดชมวิวแหลมพรหมเทพ', lat: 7.761, lng: 98.306, type: 'end', description: 'จุดจบสวยที่สุด — พระอาทิตย์ตกเหนือทะเลอันดามัน' },
    ],
  },
  {
    id: '6',
    title: 'ตะวันออกสู่เมืองเก่า · รัษฎาและถนนถลาง',
    description: 'จากตลาดชุมชนรัษฎา ผ่านสวนผลไม้ท้องถิ่น มาจบที่ย่านเมืองเก่าพร้อมหมี่ฮกเกี้ยนตำนาน',
    creator: creator(8),
    price: 5100,
    rating: 4.7,
    aiMatch: 90,
    tags: ['มรดก', 'ตลาดชุมชน', 'เดินเที่ยว'],
    category: 'heritage',
    image: getCommunityImage(13),
    district: 'รัษฎา–เมือง',
    duration: '4 ชม.',
    stops: 6,
    waypoints: wps(
      communityWp(13, 'meeting'),
      communityWp(4, 'activity'),
      poiWp('resto-mee-hokkien', 'restaurant'),
      poiWp('landmark-onon-hotel', 'attraction'),
      { name: 'ถนนถลาง–ย่านสีสัน', lat: 7.884, lng: 98.39, type: 'shop', description: 'เดินชมตึกเก่า คาเฟ่ และร้านของฝาก' },
      poiWp('landmark-wat-chalong', 'end'),
    ),
  },
  {
    id: '7',
    title: 'เกาะมะพร้าว · ล็อบสเตอร์และวิถีชาวเกาะ',
    description: 'นั่งเรือข้ามไปเกาะมะพร้าว กินล็อบสเตอร์ย่างสด ดำน้ำตื้น และเรียนรู้ชีวิตชาวประมงเกาะเล็ก',
    creator: creator(10),
    price: 6900,
    rating: 4.8,
    aiMatch: 94,
    tags: ['ทะเล', 'อาหาร', 'เกาะ', 'ครอบครัว'],
    category: 'food',
    badge: 'ยอดนิยม',
    image: getCommunityImage(11),
    district: 'เกาะมะพร้าว',
    duration: '5 ชม.',
    stops: 5,
    featured: true,
    waypoints: wps(
      communityWp(11, 'meeting'),
      poiWp('resto-maphrao-lobster', 'restaurant'),
      { name: 'จุดดำน้ำตื้นเกาะมะพร้าว', lat: 7.736, lng: 98.403, type: 'activity', description: 'ดูปะการังและปลาเล็กในน้ำใส' },
      communityWp(7, 'activity', 'แวะชมวิถีชาวประมงแหลมพันวาก่อนกลับ'),
      poiWp('resto-phanwa-seafood', 'end'),
    ),
  },
  {
    id: '8',
    title: 'ป่าชายเลนบางโรง · ตลาดทะเลชาวบ้าน',
    description: 'ล่องเรือชมป่าชายเลน ตลาดอาหารทะเลบางโรง และสัมผัสวิถีชาวประมงฝั่งตะวันออก',
    creator: creator(9),
    price: 4800,
    rating: 4.6,
    aiMatch: 88,
    tags: ['ธรรมชาติ', 'ทะเล', 'อีโค่ทัวร์'],
    category: 'nature',
    image: getCommunityImage(12),
    district: 'ป่าคลอก',
    duration: '4 ชม.',
    stops: 5,
    isNew: true,
    waypoints: wps(
      communityWp(12, 'meeting'),
      { name: 'ล่องเรือป่าชายเลน', lat: 8.065, lng: 98.416, type: 'activity', description: 'ชมระบบนิเวศชายเลนกับไกด์ท้องถิ่น' },
      poiWp('resto-bangrong-market', 'restaurant'),
      communityWp(13, 'activity'),
      { name: 'ท่าเรือบ้านบางโรง', lat: 8.067, lng: 98.417, type: 'end', description: 'จุดจบริมท่าเรือ ชมวิวอ่าวภูเก็ต' },
    ),
  },
  {
    id: '9',
    title: 'ป่าตองลึกซึ้ง · ชุมชนหลังซอยกับหาดกมลา',
    description: 'ค้นพบป่าตองที่คนท้องถิ่นรู้จัก สตรีทฟู้ดหลังซอย แวะบ้านบางวาน OTOP แล้วพักผ่อนหาดกมลา',
    creator: creator(11),
    price: 4500,
    rating: 4.5,
    aiMatch: 86,
    tags: ['สตรีทฟู้ด', 'ชายหาด', 'งบประหยัด'],
    category: 'family',
    image: getCommunityImage(14),
    district: 'ป่าตอง–กมลา',
    duration: '4 ชม.',
    stops: 6,
    waypoints: wps(
      communityWp(14, 'meeting'),
      poiWp('resto-patong-street', 'restaurant'),
      poiWp('landmark-patong-beach', 'attraction'),
      communityWp(6, 'activity'),
      poiWp('resto-bangwan-tea', 'restaurant'),
      poiWp('landmark-kamala', 'end'),
    ),
  },
  {
    id: '10',
    title: 'ภูเก็ตเหนือ · ท่าฉัตรไชย์พบบ้านขนุน',
    description: 'จากชายหาดสามป่าท่าฉัตรไชย์ ขึ้นใต้สู่บ้านขนุน ชมโนราและขนมโคโบราณ',
    creator: creator(16),
    price: 5600,
    rating: 4.7,
    aiMatch: 91,
    tags: ['วัฒนธรรม', 'อาหารทะเล', 'โนรา'],
    category: 'community',
    image: getCommunityImage(1),
    district: 'ถลางเหนือ',
    duration: '5 ชม.',
    stops: 6,
    waypoints: wps(
      communityWp(1, 'meeting'),
      poiWp('resto-seafood-thachatchai', 'restaurant'),
      communityWp(15, 'activity'),
      poiWp('resto-sakhu-local', 'restaurant'),
      communityWp(2, 'activity'),
      poiWp('resto-kanom-ko', 'end'),
    ),
  },
  {
    id: '11',
    title: 'ฮาลาลและมรดก · บ่อแร่สู่รัษฎา',
    description: 'เรียนรู้วิถีมุสลิมบ้านบ่อแร่ ชิมข้าวหมกไก่ แล้วต่อด้วยตลาดผลไม้รัษฎา',
    creator: creator(5),
    price: 4100,
    rating: 4.6,
    aiMatch: 87,
    tags: ['ฮาลาล', 'วัฒนธรรม', 'งบประหยัด'],
    category: 'heritage',
    image: getCommunityImage(5),
    district: 'เมือง–รัษฎา',
    duration: '3.5 ชม.',
    stops: 5,
    waypoints: wps(
      communityWp(5, 'meeting'),
      poiWp('resto-halal-borrae', 'restaurant'),
      poiWp('landmark-wat-chalong', 'attraction'),
      communityWp(13, 'activity'),
      { name: 'ตลาดผลไม้รัษฎา', lat: 7.903, lng: 98.413, type: 'end', description: 'ชิมผลไม้สดตามฤดูกาลจากสวนรอบอ่าว' },
    ),
  },
  {
    id: '12',
    title: 'ชายหาดสายตะวันตก · บางเทาถึงบางวาน',
    description: 'ข้าวยำบ้านบางเทา ตลาดปลาสด แวะบ้านบางวานทำ OTOP แล้วชมพระอาทิตย์ที่หาด',
    creator: creator(15),
    price: 5300,
    rating: 4.7,
    aiMatch: 89,
    tags: ['OTOP', 'อาหาร', 'ชายหาด'],
    category: 'family',
    image: getCommunityImage(9),
    district: 'ถลาง–กะทู้',
    duration: '5 ชม.',
    stops: 6,
    waypoints: wps(
      communityWp(9, 'meeting'),
      poiWp('resto-bangtao-yam', 'restaurant'),
      communityWp(6, 'activity'),
      poiWp('resto-bangwan-tea', 'restaurant'),
      poiWp('landmark-kamala', 'attraction'),
      poiWp('landmark-viewpoint', 'end'),
    ),
  },
  {
    id: '13',
    title: 'ศิลปะถลาง · หนังตะลุงและโนรา',
    description: 'เส้นทางวัฒนธรรมเข้มข้น จากหนังตะลุงบ้านลิพอน สู่โนราบ้านขนุน และข้าวหลามบ้านเคียน',
    creator: creator(6),
    price: 5000,
    rating: 4.8,
    aiMatch: 92,
    tags: ['ศิลปะ', 'โนรา', 'หนังตะลุง'],
    category: 'community',
    badge: 'วัฒนธรรม',
    image: getCommunityImage(8),
    district: 'ถลาง',
    duration: '5 ชม.',
    stops: 7,
    waypoints: wps(
      communityWp(8, 'meeting'),
      poiWp('resto-pla-ta-lipon', 'restaurant'),
      communityWp(2, 'activity'),
      poiWp('resto-kanom-ko', 'restaurant'),
      communityWp(3, 'activity'),
      poiWp('resto-khao-lum-khian', 'restaurant'),
      communityWp(10, 'end'),
    ),
  },
  {
    id: '14',
    title: 'ฟาร์มออร์แกนิก · ม่านิกและเคียน',
    description: 'เวิร์กช็อปสมุนไพรและกรีดยางบ้านม่านิก ต่อด้วยมัดย้อมผ้าบ้านเคียน',
    creator: creator(7),
    price: 3900,
    rating: 4.5,
    aiMatch: 85,
    tags: ['ออร์แกนิก', 'เวิร์กช็อป', 'พอเพียง'],
    category: 'nature',
    image: getCommunityImage(10),
    district: 'ศรีสุนทร–ถลาง',
    duration: '4 ชม.',
    stops: 5,
    isNew: true,
    waypoints: wps(
      communityWp(10, 'meeting'),
      poiWp('resto-manik-herbal', 'restaurant'),
      { name: 'สวนสมุนไพรชุมชน', lat: 7.979, lng: 98.351, type: 'activity', description: 'เก็บใบสมุนไพรและชงเครื่องดื่มสด' },
      communityWp(3, 'activity'),
      poiWp('resto-khao-lum-khian', 'end'),
    ),
  },
  {
    id: '15',
    title: 'ใต้เกาะครบวงจร · พันวาและบ่อแร่',
    description: 'จากแหลมพันวาและพิพิธภัณฑ์สัตว์น้ำ ขึ้นเหนือสู่บ้านบ่อแร่วิถีมุสลิม',
    creator: creator(19),
    price: 6400,
    rating: 4.7,
    aiMatch: 90,
    tags: ['ทะเล', 'ฮาลาล', 'ครอบครัว'],
    category: 'nature',
    image: getCommunityImage(7),
    district: 'เมืองภูเก็ต',
    duration: '5 ชม.',
    stops: 6,
    waypoints: wps(
      communityWp(7, 'meeting'),
      poiWp('landmark-aquarium', 'attraction'),
      poiWp('resto-phanwa-seafood', 'restaurant'),
      poiWp('landmark-promthep', 'attraction'),
      communityWp(5, 'activity'),
      poiWp('resto-halal-borrae', 'end'),
    ),
  },
  {
    id: '16',
    title: 'เช้าเหนือ · สาคูและท่าฉัตรไชย์',
    description: 'เริ่มวันใหม่ที่บ้านสาคู อาหารเช้าพื้นบ้าน แล้วต่อท่าฉัตรไชย์จับจิ้งหรีดทราย',
    creator: creator(12),
    price: 4600,
    rating: 4.6,
    aiMatch: 88,
    tags: ['อาหารเช้า', 'ทะเล', 'ธรรมชาติ'],
    category: 'food',
    image: getCommunityImage(15),
    district: 'ถลางเหนือ',
    duration: '4 ชม.',
    stops: 5,
    waypoints: wps(
      communityWp(15, 'meeting'),
      poiWp('resto-sakhu-local', 'restaurant'),
      communityWp(1, 'activity'),
      poiWp('resto-seafood-thachatchai', 'restaurant'),
      { name: 'ชายหาดท่าฉัตรไชย์', lat: 8.195, lng: 98.296, type: 'end', description: 'เดินชายหาดและชมพระอาทิตย์ขึ้น' },
    ),
  },
  {
    id: '17',
    title: 'เมืองเก่าเต็มวัน · มรดกสายครีเอเตอร์',
    description: 'เส้นทางเจาะลึกย่านเมืองเก่า ตลาดคืนวันอาทิตย์ ศาลเจ้า On On Hotel และวัดฉลอง',
    creator: creator(18),
    price: 7100,
    rating: 4.9,
    aiMatch: 97,
    tags: ['มรดก', 'เดินเที่ยว', 'ถ่ายรูป'],
    category: 'heritage',
    badge: 'แนะนำโรงแรม',
    image: getCommunityImage(4),
    district: 'เมืองภูเก็ต',
    duration: '6 ชม.',
    stops: 7,
    featured: true,
    waypoints: wps(
      communityWp(4, 'meeting'),
      poiWp('landmark-onon-hotel', 'attraction'),
      poiWp('resto-mee-hokkien', 'restaurant'),
      { name: 'ตลาดใหญ่คืนวันอาทิตย์', lat: 7.8862, lng: 98.3888, type: 'shop', description: 'สตรีทฟู้ดและของฝากท้องถิ่น' },
      { name: 'ศาลเจ้าพ่อหลักเมือง', lat: 7.8835, lng: 98.3908, type: 'attraction', description: 'ศาลเจ้าศักดิ์สิทธิ์ใจกลางเมืองเก่า' },
      communityWp(5, 'activity'),
      poiWp('landmark-wat-chalong', 'end'),
    ),
  },
  {
    id: '18',
    title: 'ถลางคราฟต์ · จากเคียนสู่ม่านิก',
    description: 'มัดย้อมผ้า ข้าวหลาม โนราบ้านขนุน ปิดท้ายสมุนไพรออร์แกนิกบ้านม่านิก',
    creator: creator(14),
    price: 5400,
    rating: 4.7,
    aiMatch: 89,
    tags: ['หัตถกรรม', 'ครอบครัว', 'เวิร์กช็อป'],
    category: 'community',
    image: getCommunityImage(3),
    district: 'ถลาง',
    duration: '5 ชม.',
    stops: 7,
    waypoints: wps(
      communityWp(3, 'meeting'),
      poiWp('resto-khao-lum-khian', 'restaurant'),
      communityWp(2, 'activity'),
      poiWp('resto-kanom-ko', 'restaurant'),
      communityWp(8, 'activity'),
      communityWp(10, 'activity'),
      poiWp('resto-manik-herbal', 'end'),
    ),
  },
  {
    id: '19',
    title: 'รอบอ่าวตะวันออก · รัษฎา บางโรง พันวา',
    description: 'เส้นทางยาวรอบอ่าว จากรัษฎา ผ่านบางโรง มาจบที่แหลมพันวาและพิพิธภัณฑ์สัตว์น้ำ',
    creator: creator(8),
    price: 7800,
    rating: 4.8,
    aiMatch: 93,
    tags: ['รอบเกาะ', 'ทะเล', 'ธรรมชาติ'],
    category: 'nature',
    image: getCommunityImage(13),
    district: 'รอบอ่าวภูเก็ต',
    duration: '7 ชม.',
    stops: 7,
    badge: 'เส้นทางยาว',
    waypoints: wps(
      communityWp(13, 'meeting'),
      communityWp(12, 'activity'),
      poiWp('resto-bangrong-market', 'restaurant'),
      communityWp(7, 'activity'),
      poiWp('landmark-aquarium', 'attraction'),
      poiWp('resto-phanwa-seafood', 'restaurant'),
      poiWp('landmark-promthep', 'end'),
    ),
  },
  {
    id: '20',
    title: 'ภูเก็ตครบรส · เส้นทางไฮไลท์ 5 ชุมชน',
    description: 'เส้นทางพรีเมียมรวมไฮไลท์ — เมืองเก่า บางเทา เกาะมะพร้าว ท่าฉัตรไชย์ และแหลมพันวา',
    creator: creator(0),
    price: 8400,
    rating: 4.9,
    aiMatch: 99,
    tags: ['พรีเมียม', 'ครบรส', 'ไฮไลท์', 'เต็มวัน'],
    category: 'heritage',
    badge: 'พิเศษสุด',
    image: getCommunityImage(4),
    district: 'ทั่วภูเก็ต',
    duration: '8 ชม.',
    stops: 10,
    featured: true,
    waypoints: wps(
      communityWp(4, 'meeting'),
      poiWp('resto-mee-hokkien', 'restaurant'),
      communityWp(9, 'activity'),
      poiWp('resto-bangtao-yam', 'restaurant'),
      communityWp(11, 'activity'),
      poiWp('resto-maphrao-lobster', 'restaurant'),
      communityWp(1, 'activity'),
      poiWp('resto-seafood-thachatchai', 'restaurant'),
      communityWp(7, 'activity'),
      poiWp('landmark-promthep', 'end'),
    ),
  },
];

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
