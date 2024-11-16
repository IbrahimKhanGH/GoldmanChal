import React, { useState } from 'react';
import { PlusIcon, ArrowDownIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

function Wallet() {
  const [balance] = useState(1250.00);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [recentTransactions] = useState([
    { id: 1, type: 'deposit', amount: 100, date: '2024-03-10', description: 'Cash Deposit' },
    { id: 2, type: 'withdrawal', amount: -50, date: '2024-03-09', description: 'ATM Withdrawal' },
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Balance Card */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl text-gray-600 mb-2">Total Balance</h2>
        <div className="text-4xl font-bold text-secondary">${balance.toFixed(2)}</div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button 
          onClick={() => setShowDepositModal(true)}
          className="flex items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <PlusIcon className="h-6 w-6 mr-2 text-green-600" />
          <span>Add Money</span>
        </button>

        <button className="flex items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <ArrowDownIcon className="h-6 w-6 mr-2 text-blue-600" />
          <span>Withdraw</span>
        </button>

        <button className="flex items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <DocumentTextIcon className="h-6 w-6 mr-2 text-purple-600" />
          <span>Statement</span>
        </button>
      </div>

      {/* Deposit Methods */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Deposit Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">Local Agents</h4>
            <p className="text-gray-600">Find nearby agents to deposit money</p>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">Bank Transfer</h4>
            <p className="text-gray-600">Transfer from your bank account</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex justify-between items-center border-b pb-4">
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-gray-500">{transaction.date}</p>
              </div>
              <span className={`font-medium ${
                transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'deposit' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add Money</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Amount</label>
                <input 
                  type="number" 
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Method</label>
                <select className="w-full p-2 border rounded-lg">
                  <option>Local Agent</option>
                  <option>Bank Transfer</option>
                </select>
              </div>
              <div className="flex space-x-4">
                <button 
                  onClick={() => setShowDepositModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  className="flex-1 bg-secondary text-white py-2 rounded-lg"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Wallet; 