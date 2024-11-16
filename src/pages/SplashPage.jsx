import React from 'react';
import { Link } from 'react-router-dom';

function SplashPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">
            Financial Freedom for Everyone
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Your all-in-one solution for managing money digitally, 
            no bank account required.
          </p>
          <div className="space-x-4">
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
            <Link to="/learn-more" className="btn-primary bg-transparent border-2">
              Learn More
            </Link>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Digital Wallet" 
              description="Securely store and manage your money digitally"
            />
            <FeatureCard 
              title="Easy Payments" 
              description="Send money and pay bills with just a few taps"
            />
            <FeatureCard 
              title="Smart Savings" 
              description="Set goals and track your savings progress"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, description }) {
  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

export default SplashPage; 