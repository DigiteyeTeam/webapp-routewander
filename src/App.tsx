/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import MarketplaceLayout from './layouts/MarketplaceLayout';
import CreatorLayout from './layouts/CreatorLayout';
import TravelerLayout from './layouts/TravelerLayout';
import HotelLayout from './layouts/HotelLayout';
import { HotelReferralProvider } from './context/HotelReferralContext';
import Marketplace from './pages/Marketplace';
import RouteDetails from './pages/RouteDetails';
import Library from './pages/Library';
import RouteEditor from './pages/RouteEditor';
import Dashboard from './pages/Dashboard';
import MyRoutes from './pages/MyRoutes';
import RouteWizard from './pages/RouteWizard';
import Earnings from './pages/Earnings';
import Profile from './pages/Profile';
import Login from './pages/Login';
import TravelerTrips from './pages/TravelerTrips';
import TravelerPurchases from './pages/TravelerPurchases';
import TravelerProfile from './pages/TravelerProfile';
import HotelDashboard from './pages/HotelDashboard';
import HotelEarnings from './pages/HotelEarnings';
import HotelProfile from './pages/HotelProfile';
import HotelQr from './pages/HotelQr';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import TravelerCheckoutLogin from './pages/TravelerCheckoutLogin';

function LegacyLibraryEditRedirect() {
  const { id } = useParams();
  return <Navigate to={`/hotel/library/edit/${id}`} replace />;
}

function HotelReferralRedirect() {
  const { slug } = useParams();
  if (!slug) return <Navigate to="/" replace />;
  return <Navigate to={`/?hotel=${encodeURIComponent(slug)}`} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <HotelReferralProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/h/:slug" element={<HotelReferralRedirect />} />

        {/* ตลาดเส้นทาง + หน้าสาธารณะ (เมนูเปลี่ยนตามบทบาทที่ล็อกอิน) */}
        <Route element={<MarketplaceLayout />}>
          <Route path="/" element={<Marketplace />} />
          <Route path="/route/:id" element={<RouteDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login/checkout" element={<TravelerCheckoutLogin />} />
          <Route path="/library" element={<Navigate to="/hotel/library" replace />} />
          <Route path="/library/edit/:id" element={<LegacyLibraryEditRedirect />} />
        </Route>

        {/* ผู้สร้างเส้นทางชุมชน */}
        <Route path="/creator" element={<CreatorLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="routes" element={<MyRoutes />} />
          <Route path="routes/create" element={<RouteWizard />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* นักท่องเที่ยว */}
        <Route path="/traveler" element={<TravelerLayout />}>
          <Route path="trips" element={<TravelerTrips />} />
          <Route path="purchases" element={<TravelerPurchases />} />
          <Route path="profile" element={<TravelerProfile />} />
        </Route>
        <Route path="/traveler/missions" element={<Navigate to="/traveler/trips#missions" replace />} />

        {/* โรงแรมพันธมิตร */}
        <Route path="/hotel" element={<HotelLayout />}>
          <Route path="dashboard" element={<HotelDashboard />} />
          <Route path="qr" element={<HotelQr />} />
          <Route path="profile" element={<HotelProfile />} />
          <Route path="earnings" element={<HotelEarnings />} />
          <Route path="library" element={<Library />} />
          <Route path="library/edit/:id" element={<RouteEditor />} />
        </Route>
      </Routes>
      </HotelReferralProvider>
    </BrowserRouter>
  );
}
