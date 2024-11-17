import React from 'react';
import { 
  LightBulbIcon, 
  HomeIcon, 
  AcademicCapIcon,
  PhoneIcon,
  ShoppingBagIcon,
  TvIcon
} from '@heroicons/react/24/outline';

function Payments() {
  const billCategories = [
    { icon: <LightBulbIcon className="h-6 w-6" />, name: "Utilities" },
    { icon: <HomeIcon className="h-6 w-6" />, name: "Rent" },
    { icon: <AcademicCapIcon className="h-6 w-6" />, name: "Education" },
    { icon: <PhoneIcon className="h-6 w-6" />, name: "Mobile" },
    { icon: <ShoppingBagIcon className="h-6 w-6" />, name: "Shopping" },
    { icon: <TvIcon className="h-6 w-6" />, name: "Entertainment" }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Quick Pay Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Pay</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {billCategories.map((category, index) => (
            <button key={index} className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50">
              {category.icon}
              <span className="mt-2 text-sm">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Scan QR Code Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Scan to Pay</h2>
        <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          Click to scan QR code
        </button>
      </div>

      {/* Recent Bills */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Bills</h2>
        <div className="space-y-4">
          {/* Add recent bills list here */}
        </div>
      </div>
    </div>
  );
}

export default Payments; 