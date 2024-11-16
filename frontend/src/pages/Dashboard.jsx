import React from 'react';
import {
  CurrencyDollarIcon,
  BanknotesIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';

function Dashboard() {
  return (
    <div className="min-h-screen bg-dark-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-secondary to-indigo-600 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Total Balance</p>
              <h2 className="text-3xl font-bold text-white mt-1">$2,459.50</h2>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button className="bg-dark-200 hover:bg-dark-300 transition-colors p-4 rounded-xl flex flex-col items-center">
            <div className="bg-blue-500/10 p-3 rounded-lg mb-2">
              <BanknotesIcon className="h-6 w-6 text-blue-500" />
            </div>
            <span className="text-gray-300">Send</span>
          </button>
          {/* Add more quick actions */}
        </div>

        {/* Recent Transactions */}
        <div className="bg-dark-200 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {/* Transaction Item */}
            <div className="flex items-center justify-between p-4 bg-dark-300 rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-500/10 p-2 rounded-lg">
                  <CreditCardIcon className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-white font-medium">Netflix</p>
                  <p className="text-sm text-gray-400">Entertainment</p>
                </div>
              </div>
              <p className="text-white font-medium">-$100</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
