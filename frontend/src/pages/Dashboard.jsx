import React, { useState, useEffect } from 'react';
import {
  CurrencyDollarIcon,
  BanknotesIcon,
  CreditCardIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  CogIcon,
  QrCodeIcon,
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  GiftIcon,
  PhoneIcon,
  DocumentIcon,
  CalculatorIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import QRScanner from '../components/QRScanner';
import { Dialog } from '@headlessui/react';
import CheckScanner from '../components/CheckScanner';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const [scannerType, setScannerType] = useState(null); // 'cash' or 'check'
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showSendMoney, setShowSendMoney] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalAmount, setGoalAmount] = useState(10000);
  const [tempGoalAmount, setTempGoalAmount] = useState(goalAmount);

  useEffect(() => {
    fetchBalance();
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.savingGoal) {
      setGoalAmount(userData.savingGoal);
      setTempGoalAmount(userData.savingGoal);
    }
  }, []);

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/accounts/balance`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance);
        console.log('Fetched balance:', data.balance); // Debug log
      } else {
        console.error('Failed to fetch balance');
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleScan = async (result) => {
    try {
      console.log('Attempting deposit with:', result);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/transactions/deposit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          amount: parseFloat(result.amount)
        })
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(errorText || 'Deposit failed');
      }

      const data = await response.json();
      console.log('Deposit successful:', data);
      
      setShowScanner(false);
      fetchBalance(); // Refresh the balance
      alert(`Successfully deposited $${result.amount}`);
    } catch (error) {
      console.error('Error processing check:', error);
      alert('Error processing deposit: ' + error.message);
    }
  };

  // Mock data for transactions
  const recentTransactions = [
    { id: 1, name: 'Netflix', category: 'Entertainment', amount: -15.99, icon: CreditCardIcon, color: 'purple' },
    { id: 2, name: 'Salary', category: 'Income', amount: 3500.00, icon: BanknotesIcon, color: 'green' },
    { id: 3, name: 'Walmart', category: 'Shopping', amount: -85.32, icon: CreditCardIcon, color: 'blue' },
    { id: 4, name: 'Transfer to Sarah', category: 'Transfer', amount: -50.00, icon: ArrowUpIcon, color: 'red' },
  ];

  // Add this mock data for the chart
  const spendingData = [
    { month: 'Jan', amount: 1200 },
    { month: 'Feb', amount: 900 },
    { month: 'Mar', amount: 1500 },
    { month: 'Apr', amount: 1100 },
    { month: 'May', amount: 1800 },
    { month: 'Jun', amount: 1300 },
    { month: 'Jul', amount: 1600 },
  ];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-dark-300 p-3 rounded-lg border border-dark-400">
          <p className="text-gray-300">{`${label}: $${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const handleSaveGoal = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/auth/update-saving-goal`,
        {
          savingGoal: tempGoalAmount
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setGoalAmount(tempGoalAmount);
        const userData = JSON.parse(localStorage.getItem('user'));
        const updatedUserData = { ...userData, savingGoal: tempGoalAmount };
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        setIsEditingGoal(false);
      }
    } catch (error) {
      console.error('Failed to update saving goal:', error);
      // Add error handling here
    }
  };

  return (
    <div className="min-h-screen bg-dark-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Balance Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Main Balance */}
          <div className="col-span-2 bg-gradient-to-r from-secondary to-indigo-600 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Total Balance</p>
                <h2 className="text-3xl font-bold text-white mt-1">
                  {isLoading ? 'Loading...' : `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </h2>
                <p className="text-white/60 text-sm mt-2">+15.3% from last month</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          {/* Savings Goal */}
          <div className="bg-dark-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold">Savings Goal</h3>
              <button 
                onClick={() => {
                  setTempGoalAmount(goalAmount);
                  setIsEditingGoal(true);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{isLoading ? 'Loading...' : `$${balance.toFixed(2)}`}</p>
                <p className="text-gray-400 text-sm">
                  of ${goalAmount.toLocaleString()}
                </p>
              </div>
              <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500"
                  style={{ 
                    width: `${(8500 / goalAmount) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Updated Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
          <button 
            onClick={() => {
              setScannerType('cash');
              setShowScanner(true);
            }}
            className="bg-dark-200 hover:bg-dark-300 transition-colors p-4 rounded-xl flex flex-col items-center"
          >
            <div className="bg-green-500/10 p-3 rounded-lg mb-2">
              <BanknotesIcon className="h-6 w-6 text-green-500" />
            </div>
            <span className="text-gray-300 font-medium">Deposit Money Order</span>
            <p className="text-gray-400 text-sm mt-1 text-center">
              Quickly deposit money orders using your camera
            </p>
          </button>

          <button 
            onClick={() => {
              setScannerType('check');
              setShowScanner(true);
            }}
            className="bg-dark-200 hover:bg-dark-300 transition-colors p-4 rounded-xl flex flex-col items-center"
          >
            <div className="bg-blue-500/10 p-3 rounded-lg mb-2">
              <DocumentIcon className="h-6 w-6 text-blue-500" />
            </div>
            <span className="text-gray-300 font-medium">Deposit Check</span>
            <p className="text-gray-400 text-sm mt-1 text-center">
              Deposit checks instantly with your phone
            </p>
          </button>

          <button 
            onClick={() => navigate('/transfers')} 
            className="bg-dark-200 hover:bg-dark-300 transition-colors p-4 rounded-xl flex flex-col items-center"
          >
            <div className="bg-purple-500/10 p-3 rounded-lg mb-2">
              <ArrowUpIcon className="h-6 w-6 text-purple-500" />
            </div>
            <span className="text-gray-300 font-medium">Send Money</span>
            <p className="text-gray-400 text-sm mt-1 text-center">
              Transfer funds to friends and family
            </p>
          </button>

          <button 
            onClick={() => navigate('/budgeting')} 
            className="bg-dark-200 hover:bg-dark-300 transition-colors p-4 rounded-xl flex flex-col items-center"
          >
            <div className="bg-orange-500/10 p-3 rounded-lg mb-2">
              <CalculatorIcon className="h-6 w-6 text-orange-500" />
            </div>
            <span className="text-gray-300 font-medium">Budgeting</span>
            <p className="text-gray-400 text-sm mt-1 text-center">
              Track and manage your expenses
            </p>
          </button>
        </div>

        {/* Analytics and Transactions Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Spending Analytics */}
          <div className="col-span-2 bg-dark-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Spending Analytics</h3>
              <select className="bg-dark-300 text-gray-300 rounded-lg px-3 py-1 text-sm">
                <option>This Month</option>
                <option>Last Month</option>
                <option>Last 3 Months</option>
              </select>
            </div>
            
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendingData}>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF' }}
                    width={60}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="amount" 
                    fill="#4F46E5" 
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-dark-300 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Total Spent</p>
                <p className="text-white text-lg font-semibold">$9,400</p>
              </div>
              <div className="bg-dark-300 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Average</p>
                <p className="text-white text-lg font-semibold">$1,342</p>
              </div>
              <div className="bg-dark-300 rounded-lg p-4">
                <p className="text-gray-400 text-sm">This Month</p>
                <p className="text-white text-lg font-semibold">$1,600</p>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-dark-200 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Recent Transactions</h3>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-dark-300 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className={`bg-${transaction.color}-500/10 p-2 rounded-lg`}>
                      <transaction.icon className={`h-6 w-6 text-${transaction.color}-500`} />
                    </div>
                    <div>
                      <p className="text-white font-medium">{transaction.name}</p>
                      <p className="text-sm text-gray-400">{transaction.category}</p>
                    </div>
                  </div>
                  <p className={`font-medium ${transaction.amount > 0 ? 'text-green-500' : 'text-white'}`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scanner Modal */}
      <Dialog
        open={showScanner}
        onClose={() => setShowScanner(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/75" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-xl bg-dark-200 p-6">
            <CheckScanner 
              onScan={handleScan}
              type={scannerType}
            />
            <button
              onClick={() => setShowScanner(false)}
              className="mt-4 w-full bg-dark-300 text-white py-2 rounded-lg hover:bg-dark-400"
            >
              Cancel
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Edit Goal Modal */}
      <Dialog
        open={isEditingGoal}
        onClose={() => setIsEditingGoal(false)}
        className="relative z-50"
      >
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div className="fixed inset-0 bg-black/75" aria-hidden="true" />

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm w-full rounded-2xl bg-dark-200 p-6">
            <Dialog.Title className="text-xl font-semibold text-white mb-4">
              Edit Savings Goal
            </Dialog.Title>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  Goal Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    $
                  </span>
                  <input
                    type="number"
                    value={tempGoalAmount}
                    onChange={(e) => setTempGoalAmount(Number(e.target.value))}
                    className="w-full bg-dark-300 text-white rounded-lg pl-8 pr-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="Enter amount"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setIsEditingGoal(false)}
                  className="flex-1 bg-dark-300 text-white py-2 rounded-lg hover:bg-dark-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGoal}
                  className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

export default Dashboard;
