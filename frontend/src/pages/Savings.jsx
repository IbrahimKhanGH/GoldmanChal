import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

function Savings() {
  const [goals] = useState([
    { id: 1, name: "Emergency Fund", target: 1000, current: 750, deadline: "2024-12-31" },
    { id: 2, name: "School Fees", target: 500, current: 200, deadline: "2024-06-30" }
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Total Savings Overview */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl text-gray-600 mb-2">Total Savings</h2>
        <div className="text-4xl font-bold text-secondary">
          ${goals.reduce((acc, goal) => acc + goal.current, 0).toFixed(2)}
        </div>
      </div>

      {/* Create New Goal Button */}
      <button className="w-full md:w-auto mb-8 bg-secondary text-white px-6 py-3 rounded-lg flex items-center justify-center">
        <PlusIcon className="h-5 w-5 mr-2" />
        Create New Goal
      </button>

      {/* Savings Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(goal => (
          <div key={goal.id} className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">{goal.name}</h3>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>Progress</span>
                <span>${goal.current} / ${goal.target}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-secondary h-2.5 rounded-full"
                  style={{ width: `${(goal.current / goal.target) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Deadline: {goal.deadline}</span>
              <span>{((goal.current / goal.target) * 100).toFixed(1)}% Complete</span>
            </div>
            <div className="mt-4 flex space-x-2">
              <button className="bg-secondary text-white px-4 py-2 rounded">
                Add Money
              </button>
              <button className="border border-secondary text-secondary px-4 py-2 rounded">
                Edit Goal
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Savings; 