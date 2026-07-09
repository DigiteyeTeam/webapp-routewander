/** PHUKET LOCAL STORIES — 15 เรื่องเล่าจากชุมชนภูเก็ต (ททท.) */
export const PHUKET_LOCAL_STORIES_BOOK_URL = 'https://online.fliphtml5.com/wnzswc/oqhq';

/** หน้าเริ่มต้นชุมชนที่ 1 ใน e-book */
const COMMUNITY_FIRST_PAGE = 40;

export function getCommunityFlipbookUrl(communityNo: number): string {
  const page = COMMUNITY_FIRST_PAGE + Math.max(0, communityNo - 1);
  return `${PHUKET_LOCAL_STORIES_BOOK_URL}/#p=${page}`;
}
