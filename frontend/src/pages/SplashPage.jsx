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
        {/* Hero Section */}
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
              src="/3409190.jpg" // Make sure this image exists in your public folder
              alt="UniFi - Universal Finance" 
              className="w-full h-auto rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BanknotesIcon className="text-primary w-16 h-16" />}
              title="Easy Setup"
              description="Create your account in minutes. No minimum balance required."
              color="bg-primary"
            />
            <FeatureCard 
              icon={<ShieldCheckIcon className="text-primary w-16 h-16" />}
              title="Secure Banking"
              description="State-of-the-art security to protect your financial data."
              color="bg-secondary"
            />
            <FeatureCard 
              icon={<DevicePhoneMobileIcon className="text-primary w-16 h-16" />}
              title="24/7 Support"
              description="Our team is always here to help you with any questions."
              color="bg-tertiary"
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <FeatureCard 
              icon={<BanknotesIcon className="text-primary w-16 h-16" />}
              title="No Hidden Fees"
              description="Transparent pricing with no surprise charges. Know exactly what you're paying for."
              color="bg-primary"
            />
            <FeatureCard 
              icon={<DevicePhoneMobileIcon className="text-primary w-16 h-16" />}
              title="Mobile Banking"
              description="Manage your money on the go with our user-friendly mobile app."
              color="bg-secondary"
            />
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Take Control of Your Finances?
          </h2>
          <Link 
            to="/register" 
            className="bg-secondary text-white px-8 py-3 rounded-lg hover:bg-opacity-90 transition-all inline-block"
          >
            Start Your Journey
          </Link>
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

export default SplashPage; 