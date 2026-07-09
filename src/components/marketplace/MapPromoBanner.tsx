import promoImage from '../../images/welcomm2.png';

export default function MapPromoBanner() {
  return (
    <div
      className="absolute top-0 left-0 right-0 z-[350] flex justify-center px-2 sm:px-3 pt-2 sm:pt-3 pointer-events-none"
      aria-hidden="true"
    >
      <img
        src={promoImage}
        alt="โปรโมทการท่องเที่ยวภูเก็ต"
        className="max-h-[168px] sm:max-h-[216px] md:max-h-[240px] w-auto max-w-[min(100%,96%)] object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.25)] select-none"
        draggable={false}
      />
    </div>
  );
}
