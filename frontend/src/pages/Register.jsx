import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlaidLink } from 'react-plaid-link';
import { 
  BanknotesIcon, 
  DevicePhoneMobileIcon,
  ArrowLeftIcon 
} from '@heroicons/react/24/outline';

function Register() {
  const navigate = useNavigate();
  const [linkToken, setLinkToken] = useState(null);
  const [registrationType, setRegistrationType] = useState(null);
  const [showPlaidOverlay, setShowPlaidOverlay] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (registrationType === 'bank') {
      fetchLinkToken();
      setShowPlaidOverlay(true);
    }
  }, [registrationType]);

  const fetchLinkToken = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/create_link_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const { link_token } = await response.json();
      setLinkToken(link_token);
    } catch (error) {
      console.error('Error fetching link token:', error);
    }
  };

  const config = {
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      try {
        await fetch(`${process.env.REACT_APP_API_URL}/api/exchange_public_token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ public_token }),
        });
        setShowPlaidOverlay(false);
        navigate('/dashboard');
      } catch (error) {
        console.error('Error exchanging public token:', error);
      }
    },
    onExit: () => {
      setShowPlaidOverlay(false);
      setRegistrationType(null);
    },
  };

  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    if (showPlaidOverlay && ready && linkToken) {
      open();
    }
  }, [showPlaidOverlay, ready, linkToken, open]);

  const handleRegularSubmit = (e) => {
    e.preventDefault();
    // Handle regular registration
    navigate('/dashboard');
  };

  if (!registrationType) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary to-gray-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white">Join UniFi</h1>
            <p className="text-xl text-gray-300 mt-4">Choose how you want to get started</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Bank Account Option */}
            <div 
              onClick={() => setRegistrationType('bank')}
              className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 hover:bg-opacity-20 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-green-500 bg-opacity-20 rounded-full mb-6">
                <BanknotesIcon className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Connect Bank Account
              </h3>
              <p className="text-gray-300">
                Connect your existing bank account securely using Plaid.
              </p>
            </div>

            {/* Regular Registration Option */}
            <div 
              onClick={() => setRegistrationType('regular')}
              className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 hover:bg-opacity-20 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-500 bg-opacity-20 rounded-full mb-6">
                <DevicePhoneMobileIcon className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Basic Registration
              </h3>
              <p className="text-gray-300">
                Create an account with email and password.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (registrationType === 'regular') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary to-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <button
            onClick={() => setRegistrationType(null)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Your UniFi Account</h2>
          
          <form onSubmit={handleRegularSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-3 rounded-lg border focus:border-secondary focus:ring-1 focus:ring-secondary"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-3 rounded-lg border focus:border-secondary focus:ring-1 focus:ring-secondary"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-secondary text-white py-3 rounded-lg hover:bg-opacity-90 transition-all font-medium"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    );
  }

  return null; // When Plaid is handling the flow
}

export default Register;
