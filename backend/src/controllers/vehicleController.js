const Vehicle = require('../models/Vehicle');

// @desc    Get all vehicles for current user
// @route   GET /api/vehicles
// @access  Private
exports.getVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: vehicles.length,
      vehicles
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new vehicle
// @route   POST /api/vehicles
// @access  Private
exports.addVehicle = async (req, res, next) => {
  try {
    const { brand, model, registrationNumber, vehicleType, fuelType, color, isDefault } = req.body;

    const formattedRegNo = registrationNumber.trim().toUpperCase();

    // Check duplicate registration number for this user
    const existing = await Vehicle.findOne({
      user: req.user._id,
      registrationNumber: formattedRegNo
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `You already have a vehicle registered with number ${formattedRegNo}`
      });
    }

    // If marked as default, unset existing defaults
    if (isDefault) {
      await Vehicle.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const vehicleCount = await Vehicle.countDocuments({ user: req.user._id });

    const vehicle = await Vehicle.create({
      user: req.user._id,
      brand,
      model,
      registrationNumber: formattedRegNo,
      vehicleType,
      fuelType,
      color,
      isDefault: isDefault || vehicleCount === 0 // Make first vehicle default automatically
    });

    res.status(201).json({
      success: true,
      message: 'Vehicle added successfully!',
      vehicle
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private
exports.updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, user: req.user._id });
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found or you do not have permission to edit it.'
      });
    }

    const { brand, model, registrationNumber, vehicleType, fuelType, color, isDefault } = req.body;

    if (registrationNumber && registrationNumber.toUpperCase() !== vehicle.registrationNumber) {
      const duplicate = await Vehicle.findOne({
        user: req.user._id,
        registrationNumber: registrationNumber.toUpperCase(),
        _id: { $ne: vehicle._id }
      });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `A vehicle with number ${registrationNumber.toUpperCase()} already exists in your account.`
        });
      }
      vehicle.registrationNumber = registrationNumber.toUpperCase();
    }

    if (brand) vehicle.brand = brand;
    if (model) vehicle.model = model;
    if (vehicleType) vehicle.vehicleType = vehicleType;
    if (fuelType) vehicle.fuelType = fuelType;
    if (color) vehicle.color = color;

    if (isDefault) {
      await Vehicle.updateMany({ user: req.user._id }, { isDefault: false });
      vehicle.isDefault = true;
    }

    await vehicle.save();

    res.status(200).json({
      success: true,
      message: 'Vehicle updated successfully!',
      vehicle
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private
exports.deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found or you do not have permission to delete it.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle removed successfully.'
    });
  } catch (error) {
    next(error);
  }
};
