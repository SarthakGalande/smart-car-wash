const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
      unique: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Service description is required']
    },
    price: {
      type: Number,
      required: [true, 'Service price is required'],
      min: [0, 'Price must be greater than or equal to 0']
    },
    duration: {
      type: Number,
      required: [true, 'Duration in minutes is required'],
      min: [10, 'Duration must be at least 10 minutes']
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80'
    },
    features: [
      {
        type: String,
        trim: true
      }
    ],
    category: {
      type: String,
      enum: ['Exterior', 'Interior', 'Complete', 'Detailing', 'Specialized'],
      default: 'Complete'
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE'
    },
    isPopular: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Service', serviceSchema);
