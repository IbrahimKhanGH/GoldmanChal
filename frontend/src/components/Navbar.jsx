import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'text-accent border-b-2 border-accent' : 'text-gray-300 hover:text-white';
  };

  return (
    <nav className="bg-primary shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-white text-xl font-bold">FinanceApp</span>
            </Link>
          </div>

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