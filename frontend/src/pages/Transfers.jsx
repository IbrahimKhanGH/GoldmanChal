import React, { useState } from 'react';
import { UserPlusIcon, UserGroupIcon } from '@heroicons/react/24/outline';

function Transfers() {
  const [recentContacts] = useState([
    { id: 1, name: "John Doe", phone: "+1234567890" },
    { id: 2, name: "Jane Smith", phone: "+1987654321" }
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Transfer Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Send Money</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Recipient Phone/Email</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-lg"
                placeholder="Enter phone number or email"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Amount</label>
              <input 
                type="number" 
                className="w-full p-2 border rounded-lg"
                placeholder="Enter amount"
              />
            </div>
            <button className="w-full bg-secondary text-white py-2 rounded-lg">
              Continue
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Request Money</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">From Phone/Email</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-lg"
                placeholder="Enter phone number or email"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Amount</label>
              <input 
                type="number" 
                className="w-full p-2 border rounded-lg"
                placeholder="Enter amount"
              />
            </div>
            <button className="w-full bg-secondary text-white py-2 rounded-lg">
              Request
            </button>
          </form>
        </div>
      </div>

      {/* Recent Contacts */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Contacts</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recentContacts.map(contact => (
            <button key={contact.id} className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                <UserGroupIcon className="h-6 w-6 text-gray-600" />
              </div>
              <span className="font-medium">{contact.name}</span>
              <span className="text-sm text-gray-600">{contact.phone}</span>
            </button>
          ))}
          <button className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
              <UserPlusIcon className="h-6 w-6 text-gray-600" />
            </div>
            <span className="font-medium">Add New</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Transfers; 