const mongoose = require('mongoose');

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
  }
});

const accountSchema = new mongoose.Schema({
  accountType: {
    type: String,
    required: true,
    enum: ['checking', 'savings']
  },
  balance: {
    type: Number,
    default: 0
  },
  transactions: [{
    type: {
      type: String,
      required: true,
      enum: ['deposit', 'withdrawal', 'transfer']
    },
    amount: {
      type: Number,
      required: true
    },
    description: String,
    date: {
      type: Date,
      default: Date.now
    }
  }]
});

accountSchema.methods.updateBalance = async function(amount, type) {
  if (type === 'deposit') {
    this.balance += amount;
  } else if (type === 'withdrawal' || type === 'transfer') {
    this.balance -= amount;
  }
  return this.balance;
};

userSchema.add({
  accounts: [accountSchema]
});

module.exports = mongoose.model('User', userSchema); 