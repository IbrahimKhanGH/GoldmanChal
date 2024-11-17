import React, { useState } from 'react';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  UserGroupIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

function Transfers() {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');

  // Mock recent transfers data
  const recentTransfers = [
    { id: 1, name: 'Sarah Johnson', amount: 50.00, type: 'sent', date: '2024-03-15' },
    { id: 2, name: 'Mike Smith', amount: 30.00, type: 'received', date: '2024-03-14' },
    { id: 3, name: 'Emma Davis', amount: 25.00, type: 'sent', date: '2024-03-13' },
  ];

  return (
    <div className="min-h-screen bg-dark-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Transfer Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Send Money */}
          <div className="bg-dark-200 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Send Money</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2">Recipient</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full bg-dark-300 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Enter email or phone number"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-dark-300 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Enter amount"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Send Money
              </button>
            </form>
          </div>

          {/* Quick Actions */}
          <div className="bg-dark-200 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="bg-dark-300 hover:bg-dark-400 p-4 rounded-xl flex flex-col items-center transition-colors">
                <div className="bg-blue-500/10 p-3 rounded-lg mb-2">
                  <ArrowUpIcon className="h-6 w-6 text-blue-500" />
                </div>
                <span className="text-gray-300">Send</span>
              </button>
              <button className="bg-dark-300 hover:bg-dark-400 p-4 rounded-xl flex flex-col items-center transition-colors">
                <div className="bg-green-500/10 p-3 rounded-lg mb-2">
                  <ArrowDownIcon className="h-6 w-6 text-green-500" />
                </div>
                <span className="text-gray-300">Request</span>
              </button>
              <button className="bg-dark-300 hover:bg-dark-400 p-4 rounded-xl flex flex-col items-center transition-colors">
                <div className="bg-purple-500/10 p-3 rounded-lg mb-2">
                  <UserGroupIcon className="h-6 w-6 text-purple-500" />
                </div>
                <span className="text-gray-300">Split Bill</span>
              </button>
              <button className="bg-dark-300 hover:bg-dark-400 p-4 rounded-xl flex flex-col items-center transition-colors">
                <div className="bg-yellow-500/10 p-3 rounded-lg mb-2">
                  <ClockIcon className="h-6 w-6 text-yellow-500" />
                </div>
                <span className="text-gray-300">Scheduled</span>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Transfers */}
        <div className="bg-dark-200 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Transfers</h3>
          <div className="space-y-4">
            {recentTransfers.map((transfer) => (
              <div key={transfer.id} className="flex items-center justify-between p-4 bg-dark-300 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className={`bg-${transfer.type === 'sent' ? 'red' : 'green'}-500/10 p-2 rounded-lg`}>
                    {transfer.type === 'sent' ? (
                      <ArrowUpIcon className="h-6 w-6 text-red-500" />
                    ) : (
                      <ArrowDownIcon className="h-6 w-6 text-green-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">{transfer.name}</p>
                    <p className="text-sm text-gray-400">{transfer.date}</p>
                  </div>
                </div>
                <p className={`font-medium ${transfer.type === 'received' ? 'text-green-500' : 'text-white'}`}>
                  {transfer.type === 'received' ? '+' : '-'}${transfer.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transfers; 