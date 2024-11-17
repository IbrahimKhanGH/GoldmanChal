import React, { useState } from 'react';
import { QrCodeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

function Scan() {
  const [scanType, setScanType] = useState(null);
  const navigate = useNavigate();

  // Mock function for handling scans
  const handleScan = (type) => {
    // In a real app, this would open the camera
    console.log(`Scanning ${type}...`);
    // Mock successful scan
    setTimeout(() => {
      navigate('/wallet');
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Scan & Deposit</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* QR Code Scanner */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <QrCodeIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Scan QR Code</h2>
            <p className="text-gray-600 text-center mb-4">
              Scan QR codes from trusted vendors to add funds to your wallet
            </p>
            <button
              onClick={() => handleScan('qr')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Open Scanner
            </button>
          </div>
        </div>

        {/* Check Scanner */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <DocumentTextIcon className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Deposit Check</h2>
            <p className="text-gray-600 text-center mb-4">
              Scan and deposit checks directly to your digital wallet
            </p>
            <button
              onClick={() => handleScan('check')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Scan Check
            </button>
          </div>
        </div>
      </div>

      {/* Trusted Vendors Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Trusted Cash Deposit Locations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Local Mart', distance: '0.5 miles', status: 'Open' },
            { name: 'Quick Shop', distance: '1.2 miles', status: 'Open' },
            { name: 'City Store', distance: '1.8 miles', status: 'Closed' },
          ].map((vendor) => (
            <div key={vendor.name} className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold">{vendor.name}</h3>
              <p className="text-sm text-gray-600">{vendor.distance} away</p>
              <span className={`text-sm ${
                vendor.status === 'Open' ? 'text-green-600' : 'text-red-600'
              }`}>
                {vendor.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold">1</span>
            </div>
            <h3 className="font-semibold mb-2">Visit Vendor</h3>
            <p className="text-gray-600">Go to any trusted vendor location</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold">2</span>
            </div>
            <h3 className="font-semibold mb-2">Pay Cash</h3>
            <p className="text-gray-600">Pay cash to the vendor</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold">3</span>
            </div>
            <h3 className="font-semibold mb-2">Receive Funds</h3>
            <p className="text-gray-600">Receive funds in your digital wallet</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scan; 