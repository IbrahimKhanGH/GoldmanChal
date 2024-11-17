import React, { useState } from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

function Scan() {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');

  const handleDeposit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/transactions/deposit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: parseFloat(amount) })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Deposit successful!');
        setAmount('');
        // You might want to trigger a balance refresh in the parent component
      } else {
        setMessage(data.message || 'Deposit failed');
      }
    } catch (error) {
      console.error('Deposit error:', error);
      setMessage('Error processing deposit');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <DocumentTextIcon className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Deposit Check</h2>
          <p className="text-gray-600 text-center mb-4">
            Enter the amount on your check to deposit
          </p>

          <form onSubmit={handleDeposit} className="w-full">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            {message && (
              <div className={`mb-4 text-center ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              {isProcessing ? 'Processing...' : 'Deposit Check'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Scan; 