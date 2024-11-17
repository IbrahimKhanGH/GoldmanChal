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
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    street1: '',
    street2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [passwordError, setPasswordError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    navigate('/dashboard');
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    setPasswordError('');
    setRegistrationStep(2);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add logging to debug
      console.log('Sending registration data:', formData);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          address: {
            street1: formData.street1,
            street2: formData.street2,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store the token
      localStorage.setItem('token', data.token);
      console.log('Registration successful:', data);

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      // Add user feedback here
      alert(error.message || 'Registration failed');
    }
  };

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

          {/* Add Login Button */}
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/login')}
              className="text-white hover:text-gray-300 transition-colors"
            >
              Already have an account? Login
            </button>
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
    if (!showRegistrationForm) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-primary to-gray-900 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8">
            <button
              onClick={() => setRegistrationType(null)}
              className="flex items-center text-white hover:text-gray-300 mb-6"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Options
            </button>

            <div className="text-center">
              <DevicePhoneMobileIcon className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">
                Phone-Based Banking
              </h2>
              <p className="text-gray-300 mb-8">
                Start your digital banking journey with just your phone number. No traditional bank account required.
              </p>
              <button
                onClick={() => setShowRegistrationForm(true)}
                className="w-full bg-secondary text-white py-3 rounded-lg hover:bg-opacity-90 transition-all font-medium"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-primary to-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <button
            onClick={() => registrationStep === 1 ? setShowRegistrationForm(false) : setRegistrationStep(1)}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>

          {/* Progress indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className={`h-2 w-2 rounded-full ${registrationStep === 1 ? 'bg-secondary' : 'bg-gray-300'} mr-2`}></div>
            <div className={`h-2 w-2 rounded-full ${registrationStep === 2 ? 'bg-secondary' : 'bg-gray-300'}`}></div>
          </div>

          {registrationStep === 1 ? (
            <>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Your Account</h2>
              <p className="text-gray-600 mb-8">Get started with digital banking</p>

              <form onSubmit={handleNextStep} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-secondary focus:border-secondary`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      handleInputChange(e);
                      // Clear error when user starts typing again
                      if (passwordError) setPasswordError('');
                    }}
                    className={`w-full px-3 py-2 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-secondary focus:border-secondary`}
                    required
                  />
                  {passwordError && (
                    <p className="mt-1 text-sm text-red-600">
                      {passwordError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-secondary text-white py-3 rounded-lg hover:bg-opacity-90 transition-all font-medium mt-6"
                >
                  Next
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Address Information</h2>
              <p className="text-gray-600 mb-8">Where can we reach you?</p>

              <form onSubmit={handleFinalSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    name="street1"
                    value={formData.street1}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apartment, suite, etc. (optional)</label>
                  <input
                    type="text"
                    name="street2"
                    value={formData.street2}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-secondary text-white py-3 rounded-lg hover:bg-opacity-90 transition-all font-medium mt-6"
                >
                  Create Account
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
}

export default Register;