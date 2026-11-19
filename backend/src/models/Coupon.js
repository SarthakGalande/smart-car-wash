const mongoose = require('mongoose');
const { DISCOUNT_TYPES } = require('../config/constants');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      default: ''
    },
    discountType: {
      type: String,
      enum: Object.values(DISCOUNT_TYPES),
      required: true,
      default: DISCOUNT_TYPES.PERCENTAGE
    },
    discountValue: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: [1, 'Discount value must be at least 1']
    },
    minBookingAmount: {
      type: Number,
      default: 0
    },
    maxDiscount: {
      type: Number,
      default: null
    },
    validFrom: {
      type: Date,
      default: Date.now
    },
    validUntil: {
      type: Date,
      required: [true, 'Coupon expiry date is required']
    },
    usageLimit: {
      type: Number,
      default: 100
    },
    usedCount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE'
    }
  },
  {
    timestamps: true
  }
);

couponSchema.methods.isValidForAmount = function (amount) {
  const now = new Date();
  if (this.status !== 'ACTIVE') return false;
  if (this.validFrom > now || this.validUntil < now) return false;
  if (this.usageLimit && this.usedCount >= this.usageLimit) return false;
  if (amount < this.minBookingAmount) return false;
  return true;
};

couponSchema.methods.calculateDiscount = function (amount) {
  if (!this.isValidForAmount(amount)) return 0;
  let discount = 0;
  if (this.discountType === DISCOUNT_TYPES.PERCENTAGE) {
    discount = (amount * this.discountValue) / 100;
    if (this.maxDiscount && discount > this.maxDiscount) {
      discount = this.maxDiscount;
    }
  } else {
    discount = Math.min(this.discountValue, amount);
  }
  return Math.round(discount * 100) / 100;
};

module.exports = mongoose.model('Coupon', couponSchema);
