const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['deposit', 'withdrawal', 'transfer']
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: String,
  recipientEmail: String,
  senderEmail: String,
  transferId: mongoose.Schema.Types.ObjectId
});

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  savingGoal: {
    type: Number,
    default: 10000
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    street1: String,
    street2: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  accounts: [{
    accountType: String,
    balance: {
      type: Number,
      default: 0
    }
  }],
  transactions: [transactionSchema]
});

module.exports = mongoose.model('User', userSchema); 