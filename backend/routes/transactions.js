const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const mongoose = require("mongoose");

// Transfer money between users
router.post("/transfer", auth, async (req, res) => {
  try {
    const { recipientEmail, amount } = req.body;
    const parsedAmount = parseFloat(amount);

    if (!recipientEmail || !amount || isNaN(parsedAmount)) {
      return res.status(400).json({ message: "Invalid transfer details" });
    }

    const sender = await User.findById(req.user.userId);
    const recipient = await User.findOne({ email: recipientEmail });

    if (!sender || !recipient) {
      return res.status(404).json({ message: "User not found" });
    }

    if (sender.email === recipientEmail) {
      return res.status(400).json({ message: "Cannot transfer to yourself" });
    }

    if (!sender.accounts || sender.accounts.length === 0) {
      return res.status(400).json({ message: "Sender has no account" });
    }

    if (sender.accounts[0].balance < parsedAmount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    // Initialize recipient account if needed
    if (!recipient.accounts || recipient.accounts.length === 0) {
      recipient.accounts = [{ accountType: "checking", balance: 0 }];
    }

    const transferId = new mongoose.Types.ObjectId();
    const timestamp = new Date();

    // Update balances
    sender.accounts[0].balance -= parsedAmount;
    recipient.accounts[0].balance += parsedAmount;

    // Record transaction for sender
    sender.transactions.push({
      type: "transfer",
      amount: -parsedAmount,
      date: timestamp,
      description: `Transfer to ${recipient.email}`,
      recipientEmail,
      transferId,
    });

    // Record transaction for recipient
    recipient.transactions.push({
      type: "transfer",
      amount: parsedAmount,
      date: timestamp,
      description: `Transfer from ${sender.email}`,
      senderEmail: sender.email,
      transferId,
    });

    await Promise.all([sender.save(), recipient.save()]);

    res.json({
      message: "Transfer successful",
      newBalance: sender.accounts[0].balance,
    });
  } catch (error) {
    console.error("Transfer error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get recent transfers
router.get("/transfers", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const transfers = user.transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10)
      .map((t) => ({
        _id: t._id,
        type: t.amount < 0 ? "sent" : "received",
        amount: Math.abs(t.amount),
        date: t.date,
        description: t.description,
        recipientEmail: t.recipientEmail,
        senderEmail: t.senderEmail,
      }));

    res.json({ transfers });
  } catch (error) {
    console.error("Error fetching transfers:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/deposit", auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const parsedAmount = parseFloat(amount);

    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: "Invalid deposit amount" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize account if needed
    if (!user.accounts || user.accounts.length === 0) {
      user.accounts = [{ accountType: "checking", balance: 0 }];
    }

    // Update balance
    user.accounts[0].balance += parsedAmount;

    // Record transaction
    user.transactions.push({
      type: "deposit",
      amount: parsedAmount,
      date: new Date(),
      description: "Check/Cash Deposit",
    });

    await user.save();

    res.json({
      message: "Deposit successful",
      newBalance: user.accounts[0].balance,
    });
  } catch (error) {
    console.error("Deposit error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
