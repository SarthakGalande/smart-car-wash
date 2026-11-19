const mongoose = require('mongoose');
const { BOOKING_STATUS, PAYMENT_STATUS, PAYMENT_METHODS } = require('../config/constants');

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer is required']
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle is required']
    },
    vehicleSnapshot: {
      brand: String,
      model: String,
      registrationNumber: String,
      vehicleType: String,
      color: String
    },
    center: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WashCenter',
      required: [true, 'Wash center is required']
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      default: null
    },
    services: [
      {
        service: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Service'
        },
        serviceName: String,
        price: Number
      }
    ],
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TimeSlot',
      default: null
    },
    bookingDate: {
      type: String, // YYYY-MM-DD
      required: [true, 'Booking date is required']
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required']
    },
    basePrice: {
      type: Number,
      default: 0
    },
    packagePrice: {
      type: Number,
      default: 0
    },
    servicesPrice: {
      type: Number,
      default: 0
    },
    discountAmount: {
      type: Number,
      default: 0
    },
    taxAmount: {
      type: Number,
      default: 0
    },
    finalAmount: {
      type: Number,
      required: [true, 'Final amount is required']
    },
    couponApplied: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
      default: null
    },
    bookingStatus: {
      type: String,
      enum: Object.values(BOOKING_STATUS),
      default: BOOKING_STATUS.PENDING
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHODS),
      default: PAYMENT_METHODS.CASH
    },
    cancellationReason: {
      type: String,
      default: ''
    },
    cancelledAt: {
      type: Date
    },
    rescheduledFrom: {
      date: String,
      timeSlot: String
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

bookingSchema.index({ user: 1, bookingDate: -1 });
bookingSchema.index({ bookingStatus: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
