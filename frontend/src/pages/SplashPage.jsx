import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BanknotesIcon, 
  DevicePhoneMobileIcon, 
  QrCodeIcon,
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';

function SplashPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-6 text-white">
              Welcome to UniFi
              <span className="block text-secondary mt-2">Universal Finance for All</span>
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              Your bridge to digital banking. Simple, accessible, and designed for everyone.
            </p>
            <div className="space-x-4">
              <Link 
                to="/register" 
                className="bg-secondary text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all inline-block"
              >
                Join UniFi
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="/3409190.jpg" 
              alt="UniFi - Universal Finance" 
              className="w-full h-auto rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Problem Statement */}
        <div className="mt-24">
          <div className="bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-lg">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Why UniFi?</h2>
            <p className="text-gray-300 text-center max-w-2xl mx-auto">
              Traditional banking leaves billions behind. UniFi makes digital banking accessible to everyone, 
              regardless of their banking history or status.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<DevicePhoneMobileIcon className="h-8 w-8" />}
              title="Digital First"
              description="Manage your money entirely from your smartphone"
              color="bg-blue-500"
            />
            <FeatureCard 
              icon={<QrCodeIcon className="h-8 w-8" />}
              title="Easy Deposits"
              description="Deposit cash at trusted locations using QR codes"
              color="bg-purple-500"
            />
            <FeatureCard 
              icon={<ShieldCheckIcon className="h-8 w-8" />}
              title="Secure & Protected"
              description="Your money is safe and protected"
              color="bg-green-500"
            />
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StepCard 
              number="1"
              title="Sign Up"
              description="Create your account in minutes"
            />
            <StepCard 
              number="2"
              title="Add Money"
              description="Deposit cash or connect your bank"
            />
            <StepCard 
              number="3"
              title="Manage"
              description="Track spending and save money"
            />
            <StepCard 
              number="4"
              title="Pay & Transfer"
              description="Send money and pay bills easily"
            />
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-24 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <TrustIndicator number="100k+" label="Users" />
            <TrustIndicator number="1M+" label="Transactions" />
            <TrustIndicator number="50+" label="Vendor Locations" />
            <TrustIndicator number="4.8" label="App Rating" />
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <div className="bg-white bg-opacity-10 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of people who are already managing their money digitally
            </p>
            <Link 
              to="/register" 
              className="bg-secondary text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all inline-block"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }) {
  return (
    <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-lg">
      <div className={`${color} w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-opacity-20`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }) {
  return (
    <div className="relative">
      <div className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-lg">
        <div className="text-4xl font-bold text-secondary mb-4">{number}</div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
    </div>
  );
}

function TrustIndicator({ number, label }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-white mb-2">{number}</div>
      <div className="text-gray-300">{label}</div>
    </div>
  );
}

export default SplashPage; 