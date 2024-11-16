import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BanknotesIcon, 
  ArrowTrendingUpIcon,
  CreditCardIcon,
  UserGroupIcon,
  ArrowPathIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const mockDashboardData = {
      balance: 1250.00,
      weeklySpending: 450.00,
      monthlySpending: 1800.00,
      savingsGoal: 5000.00,
      savingsProgress: 2500.00,
      recentTransactions: [
        { id: 1, type: 'deposit', amount: 100, date: '2024-03-10', description: 'Cash Deposit' },
        { id: 2, type: 'payment', amount: -50, date: '2024-03-09', description: 'Utility Bill' },
        { id: 3, type: 'transfer', amount: -30, date: '2024-03-08', description: 'To John' },
      ],
      spendingTrend: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    };

    // Simulate API call
    setTimeout(() => {
      setDashboardData(mockDashboardData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const QuickActionCard = ({ icon, title, path, color }) => (
    <button 
      onClick={() => navigate(path)}
      className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-all flex flex-col items-center"
    >
      <div className={`${color} mb-2`}>
        {icon}
      </div>
      <h3 className="text-sm font-medium text-gray-800">{title}</h3>
    </button>
  );

  const renderQuickActions = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
      <QuickActionCard
        icon={<QrCodeIcon className="h-5 w-5" />}
        title="Scan & Deposit"
        path="/scan"
        color="text-purple-600"
      />
      <QuickActionCard
        icon={<BanknotesIcon className="h-5 w-5" />}
        title="Send Money"
        path="/transfers"
        color="text-blue-600"
      />
      <QuickActionCard
        icon={<CreditCardIcon className="h-5 w-5" />}
        title="Pay Bills"
        path="/payments"
        color="text-green-600"
      />
    </div>
  );

  const renderBalanceCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-600">Available Balance</h3>
          <ArrowPathIcon className="h-5 w-5 text-gray-400" />
        </div>
        <div className="text-3xl font-bold text-gray-800">
          ${dashboardData.balance.toFixed(2)}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-600 mb-4">Weekly Spending</h3>
        <div className="text-3xl font-bold text-gray-800">
          ${dashboardData.weeklySpending.toFixed(2)}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-gray-600 mb-4">Savings Goal</h3>
        <div className="text-3xl font-bold text-gray-800">
          ${dashboardData.savingsProgress.toFixed(2)}
          <span className="text-sm text-gray-500 ml-2">/ ${dashboardData.savingsGoal.toFixed(2)}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div 
            className="bg-green-600 h-2.5 rounded-full" 
            style={{ width: `${(dashboardData.savingsProgress / dashboardData.savingsGoal) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  const renderTransactionsAndChart = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {dashboardData.recentTransactions.map((tx) => (
            <div key={tx.id} className="flex justify-between items-center border-b pb-4">
              <div>
                <p className="font-medium">{tx.description}</p>
                <p className="text-sm text-gray-500">{tx.date}</p>
              </div>
              <span className={`font-medium ${
                tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'
              }`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Spending Trend</h3>
        <Line 
          data={{
            labels: dashboardData.spendingTrend.labels,
            datasets: [{
              label: 'Spending',
              data: dashboardData.spendingTrend.data,
              borderColor: 'rgb(59, 130, 246)',
              tension: 0.1
            }]
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: false
              }
            }
          }}
        />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {renderQuickActions()}
      {renderBalanceCards()}
      {renderTransactionsAndChart()}
    </div>
  );
}

export default Dashboard;
