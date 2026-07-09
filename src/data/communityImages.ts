import img01 from '../images/routesImage/1.png';
import img02 from '../images/routesImage/2.png';
import img03 from '../images/routesImage/3.png';
import img04 from '../images/routesImage/4.png';
import img05 from '../images/routesImage/5.png';
import img06 from '../images/routesImage/6.png';
import img07 from '../images/routesImage/7.png';
import img08 from '../images/routesImage/8.png';
import img09 from '../images/routesImage/9.png';
import img10 from '../images/routesImage/10.png';
import img11 from '../images/routesImage/11.png';
import img12 from '../images/routesImage/12.png';
import img13 from '../images/routesImage/13.png';
import img14 from '../images/routesImage/14.png';
import img15 from '../images/routesImage/15.png';

/** ภาพชุมชน ททท. Phuket Local Stories เรียง 1–15 ตามแผนที่ */
export const COMMUNITY_IMAGES: Record<number, string> = {
  1: img01,
  2: img02,
  3: img03,
  4: img04,
  5: img05,
  6: img06,
  7: img07,
  8: img08,
  9: img09,
  10: img10,
  11: img11,
  12: img12,
  13: img13,
  14: img14,
  15: img15,
};

export function getCommunityImage(no: number): string {
  return COMMUNITY_IMAGES[no] ?? img01;
}
