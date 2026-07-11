import rwmin from '../images/rwmin.png';
import rwhotel from '../images/rwhotel.png';
import type { UserRole } from '../types/auth';
import { PRIMARY_CREATOR_AVATAR } from './guideAvatars';

/** รูปโปรไฟล์ครีเอเตอร์ (สมชาย = m1) */
export const PROFILE_AVATAR = PRIMARY_CREATOR_AVATAR;
export const CREATOR_AVATAR = PRIMARY_CREATOR_AVATAR;

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
