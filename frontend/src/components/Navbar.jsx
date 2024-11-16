import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'text-accent border-b-2 border-accent' : 'text-gray-300 hover:text-white';
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">Uni<span className="text-secondary">Fi</span></span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className={`px-3 py-2 ${isActive('/dashboard')}`}>
              Dashboard
            </Link>
            <Link to="/wallet" className={`px-3 py-2 ${isActive('/wallet')}`}>
              Wallet
            </Link>
            <Link to="/savings" className={`px-3 py-2 ${isActive('/savings')}`}>
              Savings
            </Link>
            <Link to="/payments" className={`px-3 py-2 ${isActive('/payments')}`}>
              Payments
            </Link>
            <Link to="/transfers" className={`px-3 py-2 ${isActive('/transfers')}`}>
              Transfers
            </Link>
            <Link to="/profile" className={`px-3 py-2 ${isActive('/profile')}`}>
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 