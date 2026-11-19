const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema(
  {
    center: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WashCenter',
      required: [true, 'Wash center reference is required']
    },
    date: {
      type: String, // Stored as YYYY-MM-DD for simple, robust indexing and cross-timezone comparison
      required: [true, 'Slot date is required'],
      index: true
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required']
    },
    endTime: {
      type: String,
      required: [true, 'End time is required']
    },
    capacity: {
      type: Number,
      required: true,
      default: 3,
      min: 1
    },
    bookedCount: {
      type: Number,
      default: 0,
      min: 0
    },
    isBlocked: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

timeSlotSchema.index({ center: 1, date: 1, startTime: 1 }, { unique: true });

module.exports = mongoose.model('TimeSlot', timeSlotSchema);
