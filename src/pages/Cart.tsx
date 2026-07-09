import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/marketplaceRoutes';
import { MAX_GUESTS, MIN_GUESTS } from '../data/routePricing';

export default function Cart() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { items, cartTotal, listTotal, totalSavings, removeItem, updateGuestCount } = useCart();

  const goCheckout = () => {
    if (role !== 'traveler') {
      navigate('/login/checkout');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-surface-variant" />
        <h1 className="text-2xl font-bold mb-2">ตะกร้าว่าง</h1>
        <p className="text-secondary mb-8">เลือกเส้นทางจากตลาดเส้นทางแล้วเพิ่มลงตะกร้า</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />
          ไปตลาดเส้นทาง
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับตลาดเส้นทาง
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold">ตะกร้าของฉัน</h1>
        <p className="text-secondary mt-2">{items.length} เส้นทางในตะกร้า</p>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <article
            key={item.id}
            className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border border-surface-variant bg-surface-container-lowest shadow-sm"
          >
            <img
              src={item.routeImage}
              alt=""
              className="w-full sm:w-28 h-36 sm:h-28 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link to={`/route/${item.routeId}`} className="font-bold text-lg hover:text-primary transition-colors">
                    {item.routeTitle}
                  </Link>
                  <p className="text-sm text-secondary mt-0.5">โดย {item.creatorName}</p>
                  {item.hotelName && (
                    <p className="inline-flex items-center gap-1 text-xs font-medium text-orange-700 mt-2">
                      <Building2 className="w-3.5 h-3.5" />
                      จองผ่าน {item.hotelName}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-secondary hover:text-red-600 transition-colors shrink-0"
                  aria-label="ลบออกจากตะกร้า"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
                <div>
                  <p className="text-xs font-bold text-secondary uppercase mb-2">จำนวนคน</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateGuestCount(item.id, item.guestCount - 1)}
                      disabled={item.guestCount <= MIN_GUESTS}
                      className="w-9 h-9 rounded-lg border border-surface-variant flex items-center justify-center disabled:opacity-40"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold">{item.guestCount}</span>
                    <button
                      type="button"
                      onClick={() => updateGuestCount(item.id, item.guestCount + 1)}
                      disabled={item.guestCount >= MAX_GUESTS}
                      className="w-9 h-9 rounded-lg border border-surface-variant flex items-center justify-center disabled:opacity-40"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  {item.listPrice && item.listPrice > item.subtotal && (
                    <p className="text-sm text-secondary line-through">{formatPrice(item.listPrice)}</p>
                  )}
                  <p className="text-xl font-extrabold">{formatPrice(item.subtotal)}</p>
                  <p className="text-xs text-secondary">{formatPrice(item.unitPrice)}/คน</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside className="rounded-2xl border border-surface-variant bg-surface-container-low p-6 space-y-4">
        {totalSavings > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-secondary">ราคาปกติ</span>
            <span className="line-through text-secondary">{formatPrice(listTotal)}</span>
          </div>
        )}
        {totalSavings > 0 && (
          <div className="flex justify-between text-sm text-orange-700 font-medium">
            <span>ส่วนลดผ่านโรงแรม</span>
            <span>-{formatPrice(totalSavings)}</span>
          </div>
        )}
        <div className="flex justify-between items-baseline pt-2 border-t border-surface-variant">
          <span className="font-bold text-lg">ยอดรวม</span>
          <span className="text-3xl font-extrabold">{formatPrice(cartTotal)}</span>
        </div>
        <button
          type="button"
          onClick={goCheckout}
          className="w-full h-14 bg-primary text-on-primary rounded-xl font-bold text-lg hover:opacity-90 transition-opacity"
        >
          ไปชำระเงิน
        </button>
      </aside>
    </div>
  );
}
