import React, { useEffect, useState } from 'react';
import { PlaidLink } from 'react-plaid-link';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function FinancialDashboard() {
  const [accounts, setAccounts] = useState(null);
  const [linkToken, setLinkToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  const mockAccounts = {
    bankAccounts: [
      { id: 1, name: 'Checking Account', balance: 2500.00, type: 'checking' },
      { id: 2, name: 'Savings Account', balance: 10000.00, type: 'savings' },
    ],
    transactions: [
      { id: 1, date: '2024-03-10', description: 'Grocery Store', amount: -75.50 },
      { id: 2, date: '2024-03-09', description: 'Salary Deposit', amount: 2000.00 },
      { id: 3, date: '2024-03-08', description: 'Restaurant', amount: -45.00 },
    ],
    spendingByCategory: {
      labels: ['Groceries', 'Dining', 'Transport', 'Shopping', 'Bills'],
      data: [300, 200, 150, 250, 400]
    }
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAccounts(mockAccounts);
      setIsLoading(false);
    }, 1500);
  }, []);

  const handlePlaidSuccess = (publicToken, metadata) => {
    console.log('Plaid connection successful', metadata);
    // Here you would typically send the public token to your backend
  };

  const renderAccountSummary = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {accounts.bankAccounts.map(account => (
        <div key={account.id} className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">{account.name}</h3>
          <p className="text-gray-600">Type: {account.type}</p>
          <p className="text-gray-600">Balance: ${account.balance.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : (
        <>
          {renderAccountSummary()}
          {/* Add your financial dashboard components here */}
        </>
      )}
    </div>
  );
}

export default FinancialDashboard; 