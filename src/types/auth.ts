export type UserRole = 'guest' | 'traveler' | 'hotel' | 'creator';

export type MockUser = {
  role: UserRole;
  name: string;
  subtitle: string;
};

export const ROLE_LABELS: Record<Exclude<UserRole, 'guest'>, string> = {
  traveler: 'นักท่องเที่ยว',
  hotel: 'โรงแรมพันธมิตร',
  creator: 'ผู้สร้างเส้นทางชุมชน',
};

export const MOCK_USERS: Record<Exclude<UserRole, 'guest'>, MockUser> = {
  traveler: {
    role: 'traveler',
    name: 'คุณมิ้นท์',
    subtitle: 'นักท่องเที่ยว',
  },
  hotel: {
    role: 'hotel',
    name: 'โรงแรมภูเก็ตวิว',
    subtitle: 'โรงแรมพันธมิตร',
  },
  creator: {
    role: 'creator',
    name: 'สมชาย ใจดี',
    subtitle: 'ผู้สร้างเส้นทางชุมชน',
  },
};
