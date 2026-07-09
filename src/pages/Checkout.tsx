import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, CheckCircle, CreditCard, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/marketplaceRoutes';
import { completeCheckout } from '../data/travelerProfile';

type PaymentMethod = 'card' | 'promptpay';

export default function Checkout() {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { items, cartTotal, listTotal, totalSavings, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  if (role !== 'traveler') {
    return <Navigate to="/login/checkout" replace />;
  }

  if (items.length === 0 && !done) {
    return <Navigate to="/cart" replace />;
  }

  const handleConfirm = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 800));

    completeCheckout(
      items.map((item) => ({
        routeId: item.routeId,
        routeTitle: item.routeTitle,
        guestCount: item.guestCount,
        amount: item.subtotal,
        listPrice: item.listPrice,
        hotelSlug: item.hotelSlug,
        hotelName: item.hotelName,
      })),
      paymentMethod === 'card' ? 'บัตรเครดิต ·••• 4242' : 'PromptPay',
    );

    clearCart();
    setDone(true);
    setProcessing(false);
  };

  if (done) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-primary/15 text-primary flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-9 h-9" />
        </div>
        <h1 className="text-3xl font-bold mb-2">ชำระเงินสำเร็จ</h1>
        <p className="text-secondary mb-8">การจองเส้นทางของคุณพร้อมแล้ว — ดูรายละเอียดในทริปและประวัติการซื้อ</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {role === 'traveler' && (
            <>
              <Link
                to="/traveler/trips"
                className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-opacity"
              >
                ดูทริปของฉัน
              </Link>
              <Link
                to="/traveler/purchases"
                className="px-6 py-3 border border-surface-variant rounded-xl font-bold hover:bg-surface-container-low transition-colors"
              >
                ประวัติการซื้อ
              </Link>
            </>
          )}
          {role !== 'traveler' && (
            <Link
              to="/"
              className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-opacity"
            >
              กลับตลาดเส้นทาง
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 pb-12">
      <div className="lg:col-span-3 space-y-6">
        <div>
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับตะกร้า
          </Link>
          <h1 className="text-3xl font-bold">ชำระเงิน</h1>
        </div>

        <section className="rounded-2xl border border-surface-variant bg-surface-container-lowest p-6 space-y-4">
          <h2 className="font-bold text-lg">สรุปการจอง</h2>
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 py-3 border-b border-surface-variant last:border-0">
              <img src={item.routeImage} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate">{item.routeTitle}</p>
                <p className="text-sm text-secondary">{item.guestCount} คน · {formatPrice(item.unitPrice)}/คน</p>
                {item.hotelName && (
                  <p className="text-xs text-orange-700 flex items-center gap-1 mt-1">
                    <Building2 className="w-3 h-3" />
                    {item.hotelName}
                  </p>
                )}
              </div>
              <p className="font-bold shrink-0">{formatPrice(item.subtotal)}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-surface-variant bg-surface-container-lowest p-6">
          <h2 className="font-bold text-lg mb-4">วิธีชำระเงิน</h2>
          <div className="space-y-3">
            <label
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                paymentMethod === 'card' ? 'border-primary bg-primary-container/20' : 'border-surface-variant'
              }`}
            >
              <input
                type="radio"
                name="payment"
                className="sr-only"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
              />
              <CreditCard className="w-6 h-6 text-primary shrink-0" />
              <div>
                <p className="font-bold">บัตรเครดิต / เดบิต</p>
                <p className="text-sm text-secondary">Visa · Mastercard ·••• 4242</p>
              </div>
            </label>
            <label
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                paymentMethod === 'promptpay' ? 'border-primary bg-primary-container/20' : 'border-surface-variant'
              }`}
            >
              <input
                type="radio"
                name="payment"
                className="sr-only"
                checked={paymentMethod === 'promptpay'}
                onChange={() => setPaymentMethod('promptpay')}
              />
              <Smartphone className="w-6 h-6 text-primary shrink-0" />
              <div>
                <p className="font-bold">PromptPay</p>
                <p className="text-sm text-secondary">สแกน QR ชำระทันที</p>
              </div>
            </label>
          </div>
        </section>
      </div>

      <aside className="lg:col-span-2">
        <div className="rounded-2xl border border-surface-variant bg-surface-container-low p-6 sticky top-28 space-y-4">
          {totalSavings > 0 && (
            <>
              <div className="flex justify-between text-sm text-secondary">
                <span>ราคาปกติ</span>
                <span className="line-through">{formatPrice(listTotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-orange-700 font-medium">
                <span>ส่วนลดโรงแรม</span>
                <span>-{formatPrice(totalSavings)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between items-baseline pt-2 border-t border-surface-variant">
            <span className="font-bold">ยอดชำระ</span>
            <span className="text-2xl font-extrabold">{formatPrice(cartTotal)}</span>
          </div>
          <button
            type="button"
            disabled={processing}
            onClick={() => void handleConfirm()}
            className="w-full h-14 bg-primary text-on-primary rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {processing ? 'กำลังชำระเงิน...' : `ยืนยันชำระ ${formatPrice(cartTotal)}`}
          </button>
          <p className="text-xs text-center text-secondary">การชำระเงินเป็นการจำลองสำหรับเดโม</p>
        </div>
      </aside>
    </div>
  );
}
