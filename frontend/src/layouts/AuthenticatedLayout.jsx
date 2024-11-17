import React from 'react';
import Navbar from '../components/Navbar';
import FloatingChatButton from '../components/FloatingChatButton';

function AuthenticatedLayout({ children }) {
  return (
    <div className="min-h-screen bg-dark-100">
      <Navbar />
      {children}
      <FloatingChatButton />
    </div>
  );
}

export default AuthenticatedLayout; 