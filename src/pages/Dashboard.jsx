import React from 'react';
import { Link } from 'react-router-dom';
import { 
  WalletIcon, 
  ArrowTrendingUpIcon, 
  ClockIcon, 
  ArrowPathIcon,
  BanknotesIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

function Dashboard() {
  const walletBalance = 1250.00;
  const savingsGoals = [
    { id: 1, name: "Emergency Fund", target: 1000, current: 750 },
    { id: 2, name: "School Fees", target: 500, current: 200 }
  ];
  const recentTransactions = [
    { id: 1, type: "deposit", amount: 100, date: "2024-03-10", description: "Deposit via Agent" },
    { id: 2, type: "payment", amount: -50, date: "2024-03-09", description: "Utility Bill" },
    { id: 3, type: "transfer", amount: -30, date: "2024-03-08", description: "Transfer to John" }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Main Balance Card */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Welcome Back, User!</h2>
          <WalletIcon className="h-8 w-8 text-secondary" />
        </div>
        <div className="text-3xl font-bold text-secondary">
          ${walletBalance.toFixed(2)}
        </div>
        <p className="text-gray-600">Available Balance</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <QuickActionCard
          title="Add Money"
          icon={<BanknotesIcon className="h-6 w-6" />}
          link="/wallet"
          color="bg-green-100 text-green-600"
        />
        <QuickActionCard
          title="Send Money"
          icon={<ArrowPathIcon className="h-6 w-6" />}
          link="/transfers"
          color="bg-blue-100 text-blue-600"
        />
        <QuickActionCard
          title="Learn Finance"
          icon={<BookOpenIcon className="h-6 w-6" />}
          link="/learn"
          color="bg-purple-100 text-purple-600"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Savings Goals */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Savings Goals</h3>
          <div className="space-y-4">
            {savingsGoals.map(goal => (
              <div key={goal.id} className="border-b pb-4">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{goal.name}</span>
                  <span className="text-gray-600">
                    ${goal.current} / ${goal.target}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-secondary h-2.5 rounded-full"
                    style={{ width: `${(goal.current / goal.target) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {recentTransactions.map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center">
                  <TransactionIcon type={transaction.type} />
                  <div className="ml-4">
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <span className={`font-medium ${
                  transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({ title, icon, link, color }) {
  return (
    <Link to={link} className={`${color} rounded-lg p-4 flex items-center justify-between hover:opacity-90 transition-opacity`}>
      <span className="font-medium">{title}</span>
      {icon}
    </Link>
  );
}

function TransactionIcon({ type }) {
  const icons = {
    deposit: <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />,
    payment: <BanknotesIcon className="h-6 w-6 text-red-600" />,
    transfer: <ArrowPathIcon className="h-6 w-6 text-blue-600" />
  };
  return icons[type] || <ClockIcon className="h-6 w-6 text-gray-600" />;
}

export default Dashboard;
