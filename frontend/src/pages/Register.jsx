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

  useEffect(() => {
    if (registrationType === 'bank') {
      fetchLinkToken();
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

  const { open, ready } = usePlaidLink({
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
        navigate('/dashboard');
      } catch (error) {
        console.error('Error exchanging public token:', error);
      }
    },
    onExit: () => {
      setRegistrationType(null);
    },
  });

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  if (!registrationType) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary to-gray-900 flex items-center justify-center px-4">
        <div className="max-w-4xl w-full">
          <h2 className="text-4xl font-bold text-white text-center mb-4">
            Choose Your Path to Financial Freedom
          </h2>
          <p className="text-gray-300 text-center mb-12 text-lg">
            Select the option that best suits your needs
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Bank Account Option */}
            <div 
              className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 hover:bg-opacity-20 transition-all cursor-pointer"
              onClick={() => setRegistrationType('bank')}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-green-500 bg-opacity-20 rounded-full mb-6">
                <BanknotesIcon className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                I Have a Bank Account
              </h3>
              <p className="text-gray-300 mb-6">
                Connect your existing bank account securely using Plaid for seamless financial management.
              </p>
            </div>

            {/* Non-Bank Option */}
            <div 
              className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 hover:bg-opacity-20 transition-all cursor-pointer"
              onClick={() => setRegistrationType('phone')}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-500 bg-opacity-20 rounded-full mb-6">
                <DevicePhoneMobileIcon className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                I Don't Have a Bank Account
              </h3>
              <p className="text-gray-300 mb-6">
                Start your digital banking journey with just your phone number or email.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (registrationType === 'bank' && ready && linkToken) {
    open();
    return null;
  }

  if (registrationType === 'phone') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary to-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <button
            onClick={() => setRegistrationType(null)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Options
          </button>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Your Account</h2>
          <p className="text-gray-600 mb-8">Get started with digital banking</p>

          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            {/* Form fields */}
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

  return null;
}

export default Register;
