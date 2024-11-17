import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import SplashPage from './pages/SplashPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Wallet from './pages/Wallet';
import Savings from './pages/Savings';
import Payments from './pages/Payments';
import Transfers from './pages/Transfers';
import Profile from './pages/Profile';
import Scan from './pages/Scan';
import Budgeting from './pages/Budgeting';

function AppContent() {
  const location = useLocation();
  const showNavbar = !['/login', '/register', '/'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-100">
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/savings" element={<Savings />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/transfers" element={<Transfers />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/budgeting" element={<Budgeting />} />
      </Routes>
    </div>
  );
}

export default AppContent; 