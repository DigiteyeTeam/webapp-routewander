import rwai1 from '../images/rwai1.png';
import rwmin from '../images/rwmin.png';
import rwhotel from '../images/rwhotel.png';
import type { UserRole } from '../types/auth';

/** รูปโปรไฟล์ครีเอเตอร์ */
export const PROFILE_AVATAR = rwai1;
export const CREATOR_AVATAR = rwai1;

/** รูปโปรไฟล์นักท่องเที่ยว */
export const TRAVELER_AVATAR = rwmin;

/** รูปโปรไฟล์โรงแรม */
export const HOTEL_AVATAR = rwhotel;

export function getProfileAvatarForRole(role: UserRole | null | undefined): string {
  switch (role) {
    case 'traveler':
      return TRAVELER_AVATAR;
    case 'hotel':
      return HOTEL_AVATAR;
    case 'creator':
      return CREATOR_AVATAR;
    default:
      return PROFILE_AVATAR;
  }
}
