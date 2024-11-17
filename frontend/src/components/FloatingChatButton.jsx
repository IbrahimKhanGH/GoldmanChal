import React, { useState, useEffect } from 'react';
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import FinancialChatbox from './FinancialChatbox';
import axios from 'axios';

const FloatingChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch balance
        const balanceResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/accounts/balance`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const balanceData = await balanceResponse.json();

        // Fetch transfers
        const transfersResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/transactions/transfers`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const transfersData = await transfersResponse.json();

        // Get user data from localStorage
        const user = JSON.parse(localStorage.getItem('user'));

        setUserData({
          balance: balanceData.balance,
          transactions: transfersData.transfers || [],
          savingGoal: user?.savingGoal || 10000,
          currentProgress: balanceData.balance,
          username: user?.username || 'User'
        });

      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (isChatOpen) {
      fetchUserData();
    }
  }, [isChatOpen]);

  return (
    <>
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-5 right-5 w-14 h-14 bg-secondary rounded-full shadow-lg flex items-center justify-center hover:bg-opacity-90 transition-colors duration-200 z-50"
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
        </button>
      )}

      {isChatOpen && userData && (
        <FinancialChatbox
          userFinancialData={userData}
          onClose={() => {
            setIsChatOpen(false);
            setUserData(null);
          }}
        />
      )}
    </>
  );
};

export default FloatingChatButton; 