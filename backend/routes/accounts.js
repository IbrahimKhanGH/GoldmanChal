const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get user's balance
router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // If user has no accounts or balance, return 0
    if (!user.accounts || user.accounts.length === 0) {
      return res.json({ balance: 0 });
    }

    // Sum up balances from all accounts
    const totalBalance = user.accounts.reduce((sum, account) => sum + account.balance, 0);
    res.json({ balance: totalBalance });
  } catch (err) {
    console.error('Error fetching balance:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

router.post('/tokenize', auth, async (req, res) => {
  try {
    // Generate a random card number (this is just an example - use a proper tokenization service in production)
    const cardNumber = Array(16).fill(0).map(() => Math.floor(Math.random() * 10)).join('');
    
    // Generate expiry date (2 years from now)
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 2);
    const expiry = `${String(expiryDate.getMonth() + 1).padStart(2, '0')}/${String(expiryDate.getFullYear()).slice(-2)}`;
    
    // Generate CVV
    const cvv = Array(3).fill(0).map(() => Math.floor(Math.random() * 10)).join('');

    res.json({
      cardNumber,
      expiry,
      cvv
    });
  } catch (error) {
    console.error('Tokenization error:', error);
    res.status(500).json({ message: 'Error tokenizing balance' });
  }
});

module.exports = router; 