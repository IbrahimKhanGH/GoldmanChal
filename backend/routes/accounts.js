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

module.exports = router; 