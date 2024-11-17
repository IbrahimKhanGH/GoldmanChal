import React, { useState } from "react";
import { Link, useLocation, NavLink } from "react-router-dom";
import {
  HomeIcon,
  ArrowsRightLeftIcon,
  UserCircleIcon,
  Bars3Icon,
  CalculatorIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import FinancialChatbox from "./FinancialChatbox";

function Navbar() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path
      ? "text-secondary"
      : "text-gray-400 hover:text-white";
  };

  // Mock financial data
  const mockFinancialData = {
    balance: 1000,
    transactions: [
      { id: 1, amount: 100, type: "deposit", date: "2024-03-20" },
      { id: 2, amount: -50, type: "withdrawal", date: "2024-03-19" },
    ],
    budgets: {
      food: 300,
      transport: 200,
      entertainment: 150,
    },
  };

  return (
    <>
      <nav className="bg-dark-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-black font-['Orbitron']">
                  <span className="text-white">UNI</span>
                  <span className="bg-gradient-to-r from-secondary to-indigo-600 text-transparent bg-clip-text">
                    FI
                  </span>
                </span>
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-2 ${isActive(
                    "/dashboard"
                  )} transition-colors duration-200`}
                >
                  <HomeIcon className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/transfers"
                  className={`flex items-center space-x-2 ${isActive(
                    "/transfers"
                  )} transition-colors duration-200`}
                >
                  <ArrowsRightLeftIcon className="h-5 w-5" />
                  <span>Transfers</span>
                </Link>

                <Link
                  to="/budgeting"
                  className={`flex items-center space-x-2 ${isActive(
                    "/budgeting"
                  )} transition-colors duration-200`}
                >
                  <CalculatorIcon className="h-5 w-5" />
                  <span>Budgeting</span>
                </Link>
                <Link
                  to="/profile"
                  className={`flex items-center space-x-2 ${isActive(
                    "/profile"
                  )} transition-colors duration-200`}
                >
                  <UserCircleIcon className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
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
      {isChatOpen && (
        <FinancialChatbox
          userFinancialData={mockFinancialData}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </>
  );
}

export default Navbar;
