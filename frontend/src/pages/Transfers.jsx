import React, { useState, useEffect } from 'react';
import { PaperAirplaneIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

function Transfers() {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [recentTransfers, setRecentTransfers] = useState([]);

  // Fetch user's balance
  useEffect(() => {
    fetchBalance();
    fetchRecentTransfers();
  }, []);

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/accounts/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setBalance(data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const fetchRecentTransfers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/transactions/transfers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setRecentTransfers(data.transfers);
    } catch (error) {
      console.error('Error fetching transfers:', error);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/transactions/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientEmail,
          amount: parseFloat(amount),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Transfer successful!');
        setRecipientEmail('');
        setAmount('');
        fetchBalance();
        fetchRecentTransfers();
      } else {
        setMessage(data.message || 'Transfer failed');
      }
    } catch (error) {
      setMessage('Error processing transfer');
      console.error('Transfer error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Balance and Transfer Form */}
          <div className="space-y-8">
            {/* Balance Display */}
            <div className="bg-white bg-opacity-10 rounded-lg shadow-lg p-6 backdrop-blur-md">
              <h2 className="text-xl text-gray-300 mb-2">Available Balance</h2>
              <div className="text-4xl font-bold text-secondary">${balance.toFixed(2)}</div>
            </div>

            {/* Transfer Form */}
            <div className="bg-white bg-opacity-10 rounded-lg shadow-lg p-6 backdrop-blur-md">
              <h2 className="text-2xl font-semibold mb-6 text-gray-100">Send Money</h2>
              <form onSubmit={handleTransfer} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Recipient Email</label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="Enter recipient's email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Amount</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="Enter amount"
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>
                {message && (
                  <div
                    className={`p-3 rounded-lg ${
                      message.includes('successful') ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}
                  >
                    {message}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-secondary text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors disabled:bg-gray-400"
                >
                  {isLoading ? 'Processing...' : 'Send Money'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Recent Transfers */}
          <div className="bg-white bg-opacity-10 rounded-lg shadow-lg p-6 backdrop-blur-md h-fit">
            <h2 className="text-2xl font-semibold mb-6 text-gray-100">Recent Transfers</h2>
            <div className="space-y-4">
              {recentTransfers.map((transfer) => (
                <div key={transfer._id} className="flex justify-between items-center border-b border-gray-700 pb-4">
                  <div>
                    <p className="font-medium text-gray-300">
                      {transfer.type === 'sent' ? 'To: ' : 'From: '}
                      {transfer.type === 'sent' ? transfer.recipientEmail : transfer.senderEmail}
                    </p>
                    <p className="text-sm text-gray-500">{new Date(transfer.date).toLocaleDateString()}</p>
                  </div>
                  <span
                    className={`font-medium ${
                      transfer.type === 'sent' ? 'text-red-500' : 'text-green-500'
                    }`}
                  >
                    {transfer.type === 'sent' ? '-' : '+'}${transfer.amount.toFixed(2)}
                  </span>
                </div>
              ))}
              {recentTransfers.length === 0 && (
                <p className="text-gray-400 text-center">No recent transfers</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transfers;
