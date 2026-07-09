/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MarketplaceLayout from './layouts/MarketplaceLayout';
import CreatorLayout from './layouts/CreatorLayout';
import Marketplace from './pages/Marketplace';
import RouteDetails from './pages/RouteDetails';
import Library from './pages/Library';
import RouteEditor from './pages/RouteEditor';
import Dashboard from './pages/Dashboard';
import MyRoutes from './pages/MyRoutes';
import RouteWizard from './pages/RouteWizard';
import Earnings from './pages/Earnings';
import Profile from './pages/Profile';
import AIAssistantWidget from './components/AIAssistantWidget';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Marketplace & Buyer Routes */}
        <Route element={<MarketplaceLayout />}>
          <Route path="/" element={<Marketplace />} />
          <Route path="/route/:id" element={<RouteDetails />} />
          <Route path="/library" element={<Library />} />
          <Route path="/library/edit/:id" element={<RouteEditor />} />
        </Route>

        {/* Creator Studio Routes */}
        <Route path="/creator" element={<CreatorLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="routes" element={<MyRoutes />} />
          <Route path="routes/create" element={<RouteWizard />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
      <AIAssistantWidget />
    </BrowserRouter>
  );
}
