import React, { useState, useEffect } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

// Add this helper function at the top of your component or in a utils file
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

function Budgeting() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [budgets, setBudgets] = useState([
    { name: 'Housing', percentage: 30, color: '#4F46E5' },
    { name: 'Food', percentage: 15, color: '#06B6D4' },
    { name: 'Transportation', percentage: 10, color: '#8B5CF6' },
    { name: 'Entertainment', percentage: 5, color: '#EC4899' },
    { name: 'Utilities', percentage: 10, color: '#F59E0B' },
    { name: 'Savings', percentage: 20, color: '#10B981' },
    { name: 'Other', percentage: 10, color: '#6B7280' }
  ]);

  useEffect(() => {
    fetchIncome();
  }, []);

  const fetchIncome = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/accounts/balance`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTotalIncome(data.balance);
      }
    } catch (error) {
      console.error('Error fetching income:', error);
    }
  };

  const handleBudgetChange = (index, newPercentage) => {
    const updatedBudgets = [...budgets];
    
    // Calculate total percentage excluding the current category
    const totalOtherPercentages = budgets.reduce((sum, budget, i) => 
      i === index ? sum : sum + budget.percentage, 0
    );

    // Only update if total won't exceed 100%
    if (totalOtherPercentages + newPercentage <= 100) {
      updatedBudgets[index] = {
        ...updatedBudgets[index],
        percentage: newPercentage
      };
      setBudgets(updatedBudgets);
    }
  };

  const resetBudgets = () => {
    setBudgets([
      { name: 'Housing', percentage: 30, color: '#4F46E5' },
      { name: 'Food', percentage: 15, color: '#06B6D4' },
      { name: 'Transportation', percentage: 10, color: '#8B5CF6' },
      { name: 'Entertainment', percentage: 5, color: '#EC4899' },
      { name: 'Utilities', percentage: 10, color: '#F59E0B' },
      { name: 'Savings', percentage: 20, color: '#10B981' },
      { name: 'Other', percentage: 10, color: '#6B7280' }
    ]);
  };

  const totalPercentage = budgets.reduce((sum, budget) => sum + budget.percentage, 0);
  const remainingPercentage = 100 - totalPercentage;

  return (
    <div className="min-h-screen bg-dark-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-dark-200 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm mb-2">Total Income</h3>
            <p className="text-2xl font-bold text-white">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="bg-dark-200 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm mb-2">Allocated</h3>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(totalIncome * (totalPercentage / 100))}
            </p>
          </div>
          <div className="bg-dark-200 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm mb-2">Unallocated</h3>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(totalIncome * (remainingPercentage / 100))}
            </p>
          </div>
        </div>

        {/* Budget Categories */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Budget List */}
          <div className="md:col-span-2 bg-dark-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Budget Categories</h2>
              <div className="flex gap-2">
                <button 
                  onClick={resetBudgets}
                  className="bg-dark-300 text-white px-4 py-2 rounded-lg hover:bg-dark-400"
                >
                  Reset
                </button>
                <button className="bg-secondary text-white px-4 py-2 rounded-lg flex items-center">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Category
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {budgets.map((budget, index) => (
                <div key={index} className="bg-dark-300 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-white font-medium">{budget.name}</h3>
                    <span className="text-gray-400">
                      {formatCurrency(totalIncome * (budget.percentage / 100))}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={budget.percentage}
                    onChange={(e) => handleBudgetChange(index, parseFloat(e.target.value))}
                    className="w-full h-2 bg-dark-400 rounded-lg appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${budget.color} 0%, ${budget.color} ${budget.percentage}%, #374151 ${budget.percentage}%, #374151 100%)`
                    }}
                  />
                  <p className="text-sm text-gray-400 mt-1">{budget.percentage}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Chart */}
          <div className="bg-dark-200 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Budget Distribution</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={budgets}
                    dataKey="percentage"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                  >
                    {budgets.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Budgeting; 