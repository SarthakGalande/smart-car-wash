const WashCenter = require('../models/WashCenter');

// @desc    Get all active wash centers
// @route   GET /api/wash-centers
// @access  Public
exports.getWashCenters = async (req, res, next) => {
  try {
    const centers = await WashCenter.find({ status: 'ACTIVE' }).sort({ centerName: 1 });
    res.status(200).json({
      success: true,
      count: centers.length,
      centers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single wash center
// @route   GET /api/wash-centers/:id
// @access  Public
exports.getWashCenterById = async (req, res, next) => {
  try {
    const center = await WashCenter.findById(req.params.id);
    if (!center) {
      return res.status(404).json({ success: false, message: 'Wash center not found' });
    }

    res.status(200).json({
      success: true,
      center
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin create wash center
// @route   POST /api/admin/wash-centers
// @access  Private (Admin)
exports.adminCreateCenter = async (req, res, next) => {
  try {
    const center = await WashCenter.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Wash center created successfully!',
      center
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin update wash center
// @route   PUT /api/admin/wash-centers/:id
// @access  Private (Admin)
exports.adminUpdateCenter = async (req, res, next) => {
  try {
    const center = await WashCenter.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!center) {
      return res.status(404).json({ success: false, message: 'Wash center not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Wash center updated successfully!',
      center
    });
  } catch (error) {
    next(error);
  }
};
