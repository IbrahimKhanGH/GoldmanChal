const mongoose = require('mongoose');

const depositImageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageHash: {
    type: String,
    required: true,
    index: true
  },
  documentType: {
    type: String,
    enum: ['check', 'moneyOrder'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'duplicate'],
    default: 'pending'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Compound index for faster lookups
depositImageSchema.index({ userId: 1, imageHash: 1 });

const DepositImage = mongoose.model('DepositImage', depositImageSchema);

module.exports = DepositImage; 