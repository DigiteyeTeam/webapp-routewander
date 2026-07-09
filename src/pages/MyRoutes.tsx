import { Plus, MapPin, Clock, Edit, Eye, Star, ShoppingCart, CircleDollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_CREATOR_PROFILE, getCreatorRoutePerformance } from '../data/creatorProfile';
import { MotionPage, MotionHeader, MotionSection, MotionList, MotionListItem, MotionCard } from '../components/motion/PortalMotion';
import { MARKETPLACE_ROUTES } from '../data/marketplaceRoutes';

export default function MyRoutes() {
  const routes = getCreatorRoutePerformance().map((route) => {
    const source = MARKETPLACE_ROUTES.find((r) => r.id === route.routeId);
    return {
      ...route,
      description: source?.description ?? 'เส้นทางท่องเที่ยวชุมชนโดยสมชาย ใจดี',
      duration: source?.duration ?? '1 วัน',
      district: source?.district ?? 'ภูเก็ต',
      stops: source?.stops ?? 0,
    };
  });

  return (
    <MotionPage className="p-6 md:p-12 lg:p-16 w-full max-w-7xl mx-auto space-y-12">
      <MotionHeader className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-display-lg text-4xl md:text-5xl font-bold text-on-surface tracking-tight mb-4">เส้นทางของฉัน</h1>
          <p className="font-body-lg text-xl text-on-surface-variant max-w-2xl opacity-80">
            Mockup เส้นทางของผู้สร้าง “{MOCK_CREATOR_PROFILE.name}”
          </p>
        </div>
        <Link to="/creator/routes/create" className="inline-flex items-center justify-center gap-2 h-[64px] px-8 bg-primary text-on-primary rounded-full font-bold text-lg shadow-md hover:scale-[1.02] active:scale-95 transition-all whitespace-nowrap">
          <Plus className="w-6 h-6" />
          สร้างเส้นทางใหม่
        </Link>
      </MotionHeader>

      <MotionList className="space-y-8">
        {routes.map(route => (
          <MotionListItem key={route.id}>
          <MotionCard className="bg-surface-container-lowest rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0px_8px_30px_rgba(0,0,0,0.08)] border border-surface-variant overflow-hidden transition-all duration-300 flex flex-col lg:flex-row group relative">
            <div className="lg:w-1/3 h-64 lg:h-auto relative overflow-hidden shrink-0 bg-surface-container flex flex-col items-center justify-center border-r border-surface-variant">
              <img src={route.image} alt={route.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4">
                <span className="px-4 py-1.5 bg-primary text-white font-bold text-sm rounded-full shadow-sm">เผยแพร่แล้ว</span>
              </div>
            </div>
            
            <div className="p-8 lg:w-2/3 flex flex-col justify-between w-full">
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                  <div>
                     <h3 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface leading-tight mb-2">{route.title}</h3>
                     <p className="text-secondary line-clamp-2">{route.description}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-6 mb-8">
                  <div className="flex items-center gap-2 text-secondary">
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">{route.district}</span>
                  </div>
                  <div className="flex items-center gap-2 text-secondary">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">{route.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-secondary">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                    <span className="font-medium">AI Match {route.aiMatch}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="rounded-xl border border-surface-variant bg-surface p-4 text-center">
                    <p className="text-xs text-secondary flex items-center justify-center gap-1">
                      <ShoppingCart className="w-4 h-4" /> ซื้อแล้ว
                    </p>
                    <p className="text-xl font-extrabold text-on-surface mt-1">{route.purchases}</p>
                  </div>
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-center">
                    <p className="text-xs text-emerald-700 flex items-center justify-center gap-1">
                      <CircleDollarSign className="w-4 h-4" /> รายได้ของคุณ
                    </p>
                    <p className="text-xl font-extrabold text-emerald-700 mt-1">{route.revenueFormatted}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <Link to="/creator/routes/create" className="h-14 flex-1 bg-primary text-on-primary rounded-full font-bold flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-95 transition-all shadow-sm">
                  <Edit className="w-5 h-5" />
                  แก้ไขเส้นทาง
                </Link>
                <Link
                  to={`/route/${route.routeId}`}
                  className="h-14 flex-1 bg-surface-container-high text-on-surface rounded-full font-bold flex items-center justify-center gap-2 hover:bg-surface-variant active:scale-95 transition-all"
                >
                  <Eye className="w-5 h-5" />
                  ดูตัวอย่าง
                </Link>
              </div>
            </div>
          </MotionCard>
          </MotionListItem>
        ))}
      </MotionList>
    </MotionPage>
  );
}
