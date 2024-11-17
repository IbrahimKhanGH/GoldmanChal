import React from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';
import {
  HomeIcon,
  ArrowsRightLeftIcon,
  UserCircleIcon,
  Bars3Icon,
  CalculatorIcon,
} from '@heroicons/react/24/outline';

function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'text-secondary' : 'text-gray-400 hover:text-white';
  };

  return (
    <nav className="bg-dark-200 border-b border-dark-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-secondary to-indigo-400 bg-clip-text text-transparent">
                UniFi
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <Link
                to="/dashboard"
                className={`flex items-center space-x-2 ${isActive('/dashboard')} transition-colors duration-200`}
              >
                <HomeIcon className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/transfers"
                className={`flex items-center space-x-2 ${isActive('/transfers')} transition-colors duration-200`}
              >
                <ArrowsRightLeftIcon className="h-5 w-5" />
                <span>Transfers</span>
              </Link>

              <Link
                to="/profile"
                className={`flex items-center space-x-2 ${isActive('/profile')} transition-colors duration-200`}
              >
                <UserCircleIcon className="h-5 w-5" />
                <span>Profile</span>
              </Link>

              <NavLink 
                to="/budgeting" 
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-gray-300 hover:bg-dark-300 rounded-lg ${
                    isActive ? 'bg-dark-300' : ''
                  }`
                }
              >
                <CalculatorIcon className="h-5 w-5 mr-2" />
                <span>Budgeting</span>
              </NavLink>
            </div>
          </div>

          <div className="md:hidden">
            <button className="text-gray-400 hover:text-white">
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 