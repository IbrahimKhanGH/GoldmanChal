import React, { useState } from 'react';

function Profile() {
  const [activeTab, setActiveTab] = useState('profile');

  const handleSignOut = () => {
    // Add your sign-out logic here
    console.log('Signing out...');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <button
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Sign Out
        </button>
      </div>

      {/* Layout Container */}
      <div className="flex gap-8">
        {/* Vertical Tabs */}
        <nav className="w-48 space-y-2">
          <button
            className={`w-full text-left px-4 py-2 rounded-lg ${
              activeTab === 'profile'
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Information
          </button>
          <button
            className={`w-full text-left px-4 py-2 rounded-lg ${
              activeTab === 'settings'
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </nav>

        {/* Tab Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <img
                  src="https://via.placeholder.com/100"
                  alt="Profile"
                  className="w-24 h-24 rounded-full"
                />
                <div>
                  <h2 className="text-xl font-semibold">John Doe</h2>
                  <p className="text-gray-600">john.doe@example.com</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> John Doe</p>
                    <p><span className="font-medium">Email:</span> john.doe@example.com</p>
                    <p><span className="font-medium">Location:</span> New York, USA</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Account Settings</h3>
                
                {/* Personal Information Form */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      id="name"
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-gray-500"
                      defaultValue="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-gray-500"
                      defaultValue="john.doe@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                      type="text"
                      id="address"
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-gray-500"
                      defaultValue="New York, USA"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    className="bg-[#2D3648] hover:bg-[#1F2937] text-white px-6 py-2 rounded-lg"
                  >
                    Save Changes
                  </button>
                </div>

                {/* Existing Notification Settings */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium mb-4">Notification Settingss</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="form-checkbox" />
                        <span>Email notifications</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="form-checkbox" />
                        <span>Two-factor authentication</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile; 