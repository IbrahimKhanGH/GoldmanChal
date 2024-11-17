const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema({
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
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['check', 'money_order'],
    required: true
  },
  serialNumber: {
    type: String,
    sparse: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'duplicate'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

depositSchema.index({ userId: 1, imageHash: 1 });
depositSchema.index({ userId: 1, serialNumber: 1 });

module.exports = mongoose.model('Deposit', depositSchema); 