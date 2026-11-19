const mongoose = require('mongoose');

const packageServiceSchema = new mongoose.Schema(
  {
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      required: true
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

packageServiceSchema.index({ package: 1, service: 1 }, { unique: true });

module.exports = mongoose.model('PackageService', packageServiceSchema);
