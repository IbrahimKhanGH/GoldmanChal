import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import SplashPage from './pages/SplashPage';
import Dashboard from './pages/Dashboard';
import Wallet from './pages/Wallet';
import Savings from './pages/Savings';
import Payments from './pages/Payments';
import Transfers from './pages/Transfers';
import Profile from './pages/Profile';

function AppContent() {
  const location = useLocation();
  const showNavbar = location.pathname !== '/';

  return (
    <div className="min-h-screen bg-gray-100">
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/savings" element={<Savings />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/transfers" element={<Transfers />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default AppContent; 