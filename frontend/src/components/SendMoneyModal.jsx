import React, { useState } from 'react';

const SendMoneyModal = ({ isOpen, onClose, onSend, maxAmount }) => {
    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);

        if (numAmount > maxAmount) {
            setError('Insufficient funds');
            return;
        }

        onSend({ amount: numAmount, recipient });
        setAmount('');
        setRecipient('');
        setError('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div 
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative bg-primary rounded-2xl shadow-xl p-6 w-[90%] max-w-md m-4">
                <h2 className="text-2xl font-bold text-white mb-6">Send Money</h2>

                {/* Available Balance Display */}
                <div className="mb-4 text-gray-300">
                    Available Balance: ${maxAmount.toLocaleString('en-US', { 
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2 
                    })}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="text-red-400 text-sm">{error}</div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Recipient Username
                        </label>
                        <input
                            type="text"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Enter username"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Amount
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-400">$</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => {
                                    setAmount(e.target.value);
                                    setError('');
                                }}
                                className="w-full pl-8 pr-4 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                                max={maxAmount}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Send Money
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SendMoneyModal;