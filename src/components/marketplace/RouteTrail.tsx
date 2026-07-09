import type { MarketplaceWaypoint } from '../../data/marketplaceRoutes';

/** แถบจุดแวะแบบเอกลักษณ์บนการ์ดเส้นทาง */
export default function RouteTrail({
  waypoints,
  color,
  maxDots = 5,
}: {
  waypoints: MarketplaceWaypoint[];
  color: string;
  maxDots?: number;
}) {
  const shown = waypoints.slice(0, maxDots);
  const extra = waypoints.length - maxDots;

  return (
    <div className="flex items-center gap-0 w-full overflow-hidden">
      {shown.map((wp, i) => (
        <div key={`${wp.name}-${i}`} className="flex items-center min-w-0 flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-0.5 min-w-0 max-w-[4.5rem]">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 shadow-sm"
              style={{ backgroundColor: color }}
            >
              {i + 1}
            </div>
            <span className="text-[9px] text-secondary truncate w-full text-center leading-tight">{wp.name.replace('ชุมชน', '')}</span>
          </div>
          {i < shown.length - 1 && (
            <div className="flex-1 h-0.5 mx-0.5 rounded-full min-w-[8px] opacity-40" style={{ backgroundColor: color }} />
          )}
        </div>
      ))}
      {extra > 0 && (
        <span className="text-[10px] font-bold text-secondary ml-1 shrink-0">+{extra}</span>
      )}
    </div>
  );
}
