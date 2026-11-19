const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    packageName: {
      type: String,
      required: [true, 'Package name is required'],
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
      required: [true, 'Package description is required']
    },
    price: {
      type: Number,
      required: [true, 'Package price is required'],
      min: [0, 'Price must be non-negative']
    },
    duration: {
      type: Number,
      required: [true, 'Estimated duration is required'],
      min: [15, 'Duration must be at least 15 minutes']
    },
    features: [
      {
        type: String,
        trim: true
      }
    ],
    includedServices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
      }
    ],
    popular: {
      type: Boolean,
      default: false
    },
    badge: {
      type: String,
      default: ''
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

module.exports = mongoose.model('Package', packageSchema);
