const mongoose = require('mongoose');
const { PAYMENT_STATUS, PAYMENT_METHODS } = require('../config/constants');

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Booking reference is required']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required']
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHODS),
      required: true,
      default: PAYMENT_METHODS.CASH
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [0, 'Amount must be non-negative']
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING
    },
    paymentDate: {
      type: Date,
      default: Date.now
    },
    gatewayDetails: {
      orderId: String,
      paymentId: String,
      signature: String
    },
    refundDetails: {
      refundId: String,
      amount: Number,
      status: String,
      date: Date,
      reason: String
    }
  },
  {
    timestamps: true
  }
);

paymentSchema.index({ user: 1, paymentDate: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
