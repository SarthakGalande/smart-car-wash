const mongoose = require('mongoose');

const washCenterSchema = new mongoose.Schema(
  {
    centerName: {
      type: String,
      required: [true, 'Center name is required'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Center address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      default: 'New Delhi'
    },
    phone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    openingTime: {
      type: String,
      default: '08:00 AM'
    },
    closingTime: {
      type: String,
      default: '08:00 PM'
    },
    capacityPerSlot: {
      type: Number,
      default: 3,
      min: 1
    },
    slotDurationMinutes: {
      type: Number,
      default: 60
    },
    rating: {
      type: Number,
      default: 4.9
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

module.exports = mongoose.model('WashCenter', washCenterSchema);
