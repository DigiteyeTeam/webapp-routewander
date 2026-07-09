import { Plus, MapPin, Clock, Edit, Eye, Image as ImageIcon, History, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function MyRoutes() {
  const [routes, setRoutes] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedRoutes = JSON.parse(localStorage.getItem('myRoutes') || '[]');
    setRoutes(savedRoutes);
  }, []);

  const deleteRoute = (id: string) => {
    const newRoutes = routes.filter(r => r.id !== id);
    setRoutes(newRoutes);
    localStorage.setItem('myRoutes', JSON.stringify(newRoutes));
  };

  const formatDistance = (meters?: number) => {
    if (!meters) return '';
    return (meters / 1000).toFixed(1) + ' กม.';
  };
  
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours} ชม. ${minutes} นาที`;
    return `${minutes} นาที`;
  };

  return (
    <div className="p-6 md:p-12 lg:p-16 w-full max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-display-lg text-4xl md:text-5xl font-bold text-on-surface tracking-tight mb-4">เส้นทางของฉัน</h1>
          <p className="font-body-lg text-xl text-on-surface-variant max-w-2xl opacity-80">
            จัดการและดูแลคู่มือท่องเที่ยวของคุณ
          </p>
        </div>
        <Link to="/creator/routes/create" className="inline-flex items-center justify-center gap-2 h-[64px] px-8 bg-primary text-on-primary rounded-full font-bold text-lg shadow-md hover:scale-[1.02] active:scale-95 transition-all whitespace-nowrap">
          <Plus className="w-6 h-6" />
          สร้างเส้นทางใหม่
        </Link>
      </div>

      <div className="space-y-8">
        {routes.length === 0 && (
           <div className="text-center py-24 bg-surface-container-lowest rounded-2xl border border-surface-variant">
             <MapPin className="w-16 h-16 mx-auto mb-4 text-surface-variant" />
             <h3 className="font-headline-md text-2xl font-bold text-on-surface mb-2">ยังไม่มีเส้นทาง</h3>
             <p className="text-secondary mb-8">เริ่มสร้างการเดินทางแรกของคุณได้เลย</p>
             <Link to="/creator/routes/create" className="inline-flex items-center justify-center gap-2 h-[48px] px-6 bg-primary text-on-primary rounded-full font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all">
               <Plus className="w-5 h-5" />
               สร้างเส้นทาง
             </Link>
           </div>
        )}
        
        {routes.map(route => (
          <div key={route.id} className="bg-surface-container-lowest rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0px_8px_30px_rgba(0,0,0,0.08)] border border-surface-variant overflow-hidden transition-all duration-300 flex flex-col lg:flex-row group relative">
            <div className="absolute top-4 right-4 z-10">
               <button onClick={() => deleteRoute(route.id)} className="w-10 h-10 bg-surface/80 backdrop-blur-md rounded-full flex items-center justify-center text-secondary hover:text-error hover:bg-error/10 shadow-sm transition-colors">
                  <Trash2 className="w-5 h-5" />
               </button>
            </div>
            <div className="lg:w-1/3 h-64 lg:h-auto relative overflow-hidden shrink-0 bg-surface-container flex flex-col items-center justify-center border-r border-surface-variant">
              {route.waypoints?.[0]?.imageUrl ? (
                <img src={route.waypoints[0].imageUrl} alt="ภาพปก" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <>
                  <ImageIcon className="w-16 h-16 text-secondary opacity-30 mb-4" />
                  <p className="text-sm font-medium text-secondary">ไม่มีภาพปก</p>
                </>
              )}
              <div className="absolute top-4 left-4">
                <span className="px-4 py-1.5 bg-secondary-container text-on-secondary-container font-bold text-sm rounded-full shadow-sm">แบบร่าง</span>
              </div>
            </div>
            
            <div className="p-8 lg:w-2/3 flex flex-col justify-between w-full">
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                  <div className="pr-12">
                     <h3 className="font-headline-lg text-2xl md:text-3xl font-bold text-on-surface leading-tight mb-2">{route.name}</h3>
                     <p className="text-secondary line-clamp-2">{route.description || 'ยังไม่มีคำอธิบาย'}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-6 mb-8">
                  <div className="flex items-center gap-2 text-secondary">
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">{route.waypoints?.length || 0} จุดแวะ</span>
                  </div>
                  {route.routeStats && (
                     <>
                        <div className="flex items-center gap-2 text-secondary">
                          <History className="w-5 h-5" />
                          <span className="font-medium">{formatDistance(route.routeStats.distance)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-secondary">
                          <Clock className="w-5 h-5" />
                          <span className="font-medium">{formatDuration(route.routeStats.duration)}</span>
                        </div>
                     </>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <button 
                  onClick={() => navigate('/creator/routes/create')}
                  className="h-14 flex-1 bg-primary text-on-primary rounded-full font-bold flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-95 transition-all shadow-sm"
                >
                  <Edit className="w-5 h-5" />
                  แก้ไขเส้นทาง
                </button>
                <button
                  onClick={() => navigate(`/route/${route.id}`)}
                  className="h-14 flex-1 bg-surface-container-high text-on-surface rounded-full font-bold flex items-center justify-center gap-2 hover:bg-surface-variant active:scale-95 transition-all"
                >
                  <Eye className="w-5 h-5" />
                  ดูตัวอย่าง
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
