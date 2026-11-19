const mongoose = require('mongoose');
const { VEHICLE_TYPES, FUEL_TYPES } = require('../config/constants');

const vehicleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Vehicle owner is required']
    },
    brand: {
      type: String,
      required: [true, 'Car brand is required'],
      trim: true
    },
    model: {
      type: String,
      required: [true, 'Car model is required'],
      trim: true
    },
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      uppercase: true,
      trim: true
    },
    vehicleType: {
      type: String,
      enum: VEHICLE_TYPES,
      default: 'Sedan',
      required: [true, 'Vehicle category is required']
    },
    fuelType: {
      type: String,
      enum: FUEL_TYPES,
      default: 'Petrol'
    },
    color: {
      type: String,
      trim: true,
      default: 'White'
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

vehicleSchema.index({ user: 1, registrationNumber: 1 }, { unique: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
