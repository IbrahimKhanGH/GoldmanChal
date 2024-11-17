import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const FinancialChatbox = ({ userFinancialData, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (userFinancialData && userFinancialData.balance !== undefined) {
      setMessages([
        {
          role: 'assistant',
          content: `Hello ${userFinancialData.username}! I'm your financial assistant. Your current balance is $${userFinancialData.balance.toFixed(2)}, and you're ${((userFinancialData.currentProgress / userFinancialData.savingGoal) * 100).toFixed(1)}% towards your saving goal. How can I help you today?`
        }
      ]);
    }
  }, [userFinancialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !userFinancialData) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/chat`,
        {
          messages: [...messages, userMessage],
          userContext: {
            balance: userFinancialData.balance,
            recentTransactions: userFinancialData.transactions.slice(0, 5),
            savingGoal: userFinancialData.savingGoal,
            currentProgress: userFinancialData.currentProgress,
            username: userFinancialData.username
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      const assistantMessage = response.data.message;
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col z-50">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center bg-secondary text-white rounded-t-lg">
        <h3 className="font-semibold">Financial Assistant</h3>
        <button onClick={onClose} className="hover:opacity-70">×</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              message.role === 'user' 
                ? 'bg-secondary/10 ml-auto max-w-[80%]' 
                : 'bg-gray-100 mr-auto max-w-[80%]'
            }`}
          >
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className="bg-gray-100 rounded-lg p-3 mr-auto max-w-[80%] animate-pulse">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your finances..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default FinancialChatbox; 