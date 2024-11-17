import React, { useState, useEffect } from 'react';
import { PaperAirplaneIcon, ArrowDownIcon, CreditCardIcon, ClipboardIcon } from '@heroicons/react/24/outline';

// Add VirtualCard component at the top of the file
const VirtualCard = ({ cardDetails, onClose }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl shadow-2xl w-96">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Virtual Debit Card</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
        </div>
        <div className="bg-gradient-to-r from-secondary to-primary p-6 rounded-xl shadow-lg mb-6">
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-1">
              <p className="text-gray-200 text-sm">Virtual Balance</p>
              <p className="text-white text-xl font-bold">${cardDetails.balance.toFixed(2)}</p>
            </div>
            <CreditCardIcon className="h-8 w-8 text-white opacity-80" />
          </div>
          <div className="space-y-4">
            <p className="text-gray-200 font-mono text-lg tracking-wider">
              {cardDetails.cardNumber.match(/.{1,4}/g).join(' ')}
            </p>
            <div className="flex justify-between">
              <div>
                <p className="text-gray-400 text-xs">Valid Thru</p>
                <p className="text-gray-200 text-sm">{cardDetails.expiry}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">CVV</p>
                <p className="text-gray-200 text-sm">{cardDetails.cvv}</p>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => copyToClipboard(cardDetails.cardNumber)}
          className="flex items-center justify-center w-full bg-secondary text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors"
        >
          <ClipboardIcon className="h-5 w-5 mr-2" />
          {copied ? 'Copied!' : 'Copy Card Number'}
        </button>
      </div>
    </div>
  );
};

// Add TokenizationLoading component
const TokenizationLoading = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl shadow-2xl w-96 text-center">
      <div className="space-y-6">
        <div className="animate-spin mx-auto">
          <CreditCardIcon className="h-12 w-12 text-secondary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Tokenizing Balance</h3>
          <div className="space-y-1">
            <div className="flex justify-center items-center space-x-2">
              <div className="w-2 h-2 bg-secondary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-secondary rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-secondary rounded-full animate-bounce delay-200"></div>
            </div>
            <p className="text-gray-400 text-sm animate-pulse">Generating secure virtual card</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

function Transfers() {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [recentTransfers, setRecentTransfers] = useState([]);
  const [isTokenizing, setIsTokenizing] = useState(false);
  const [cardDetails, setCardDetails] = useState(null);

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

  const handleTokenize = async () => {
    setIsTokenizing(true);
    try {
      const token = localStorage.getItem('token');
      
      // Show loading for at least 2 seconds
      const loadingPromise = new Promise(resolve => setTimeout(resolve, 2000));
      
      const [tokenizeResponse] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_URL}/api/accounts/tokenize`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ balance })
        }),
        loadingPromise // This ensures we show loading for at least 2 seconds
      ]);
      
      const data = await tokenizeResponse.json();
      
      // Add an additional delay before showing the card
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (tokenizeResponse.ok) {
        setCardDetails({
          cardNumber: data.cardNumber,
          expiry: data.expiry,
          cvv: data.cvv,
          balance: balance
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Tokenization error:', error);
      // You might want to show an error message to the user
    } finally {
      setIsTokenizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-gray-900 text-white overflow-hidden">
      <div className="container mx-auto px-4 py-8 max-h-screen overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Balance and Transfer Form */}
          <div className="space-y-8">
            {/* Modified Balance Display with Tokenize Button */}
            <div className="bg-white bg-opacity-10 rounded-lg shadow-lg p-6 backdrop-blur-md">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl text-gray-300 mb-2">Available Balance</h2>
                  <div className="text-4xl font-bold text-secondary">${balance.toFixed(2)}</div>
                </div>
                <button
                  onClick={handleTokenize}
                  disabled={isTokenizing}
                  className="flex items-center space-x-2 bg-secondary px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
                >
                  <CreditCardIcon className="h-5 w-5" />
                  <span>{isTokenizing ? 'Tokenizing...' : 'Tokenize'}</span>
                </button>
              </div>
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
          <div className="bg-white bg-opacity-10 rounded-lg shadow-lg p-6 backdrop-blur-md h-fit overflow-y-auto" style={{ maxHeight: '505px' }}>
            <h2 className="text-2xl font-semibold mb-6 text-gray-100">Recent Transfers</h2>
            <div className="space-y-4">
              {recentTransfers.map((transfer) => {
                console.log('Transfer:', transfer);
                
                return (
                  <div key={transfer._id} className="flex justify-between items-center border-b border-gray-700 pb-4">
                    <div>
                      <p className="font-medium text-gray-300">
                        {transfer.type === 'deposit' || transfer.description === 'Check/Cash Deposit' ? 'Money Order/Check' : 
                          transfer.type === 'sent' ? `To: ${transfer.recipientEmail}` : 
                          `From: ${transfer.senderEmail}`}
                      </p>
                      <p className="text-sm text-gray-500">{new Date(transfer.date).toLocaleDateString()}</p>
                    </div>
                    <span
                      className={`font-medium ${
                        transfer.type === 'deposit' || transfer.description === 'Check/Cash Deposit' ? 'text-green-500' :
                        transfer.type === 'sent' ? 'text-red-500' : 
                        'text-green-500'
                      }`}
                    >
                      {transfer.type === 'sent' ? '-' : '+'}${transfer.amount.toFixed(2)}
                    </span>
                  </div>
                );
              })}
              {recentTransfers.length === 0 && (
                <p className="text-gray-400 text-center">No recent transfers</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {isTokenizing && <TokenizationLoading />}
      {cardDetails && (
        <VirtualCard 
          cardDetails={cardDetails} 
          onClose={() => setCardDetails(null)} 
        />
      )}
    </div>
  );
}

export default Transfers;
