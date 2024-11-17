import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';
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
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Authenticated Routes */}
      <Route path="/dashboard" element={
        <AuthenticatedLayout>
          <Dashboard />
        </AuthenticatedLayout>
      } />
      <Route path="/transfers" element={
        <AuthenticatedLayout>
          <Transfers />
        </AuthenticatedLayout>
      } />
      <Route path="/budgeting" element={
        <AuthenticatedLayout>
          <Budgeting />
        </AuthenticatedLayout>
      } />
      <Route path="/profile" element={
        <AuthenticatedLayout>
          <Profile />
        </AuthenticatedLayout>
      } />
      {/* Add other authenticated routes similarly */}
    </Routes>
  );
}

export default AppContent; 