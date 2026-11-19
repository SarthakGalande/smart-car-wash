const Package = require('../models/Package');
const PackageService = require('../models/PackageService');

// @desc    Get all packages
// @route   GET /api/packages
// @access  Public
exports.getPackages = async (req, res, next) => {
  try {
    const packages = await Package.find({ status: 'ACTIVE' })
      .populate('includedServices', 'serviceName price duration category')
      .sort({ price: 1 });

    res.status(200).json({
      success: true,
      count: packages.length,
      packages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get package by ID
// @route   GET /api/packages/:id
// @access  Public
exports.getPackageById = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id)
      .populate('includedServices', 'serviceName description price duration features');

    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    res.status(200).json({
      success: true,
      package: pkg
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin create package
// @route   POST /api/admin/packages
// @access  Private (Admin)
exports.adminCreatePackage = async (req, res, next) => {
  try {
    const { packageName, description, price, duration, features, includedServices, popular, badge, status } = req.body;

    const slug = packageName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const pkg = await Package.create({
      packageName,
      slug,
      description,
      price: Number(price),
      duration: Number(duration),
      features: Array.isArray(features) ? features : (features ? features.split(',').map(f => f.trim()) : []),
      includedServices: includedServices || [],
      popular: !!popular,
      badge: badge || '',
      status: status || 'ACTIVE'
    });

    res.status(201).json({
      success: true,
      message: 'Package created successfully!',
      package: pkg
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin update package
// @route   PUT /api/admin/packages/:id
// @access  Private (Admin)
exports.adminUpdatePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    const { packageName, description, price, duration, features, includedServices, popular, badge, status } = req.body;

    if (packageName) {
      pkg.packageName = packageName;
      pkg.slug = packageName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (description) pkg.description = description;
    if (price !== undefined) pkg.price = Number(price);
    if (duration !== undefined) pkg.duration = Number(duration);
    if (features) {
      pkg.features = Array.isArray(features) ? features : features.split(',').map(f => f.trim());
    }
    if (includedServices) pkg.includedServices = includedServices;
    if (popular !== undefined) pkg.popular = !!popular;
    if (badge !== undefined) pkg.badge = badge;
    if (status) pkg.status = status;

    await pkg.save();

    res.status(200).json({
      success: true,
      message: 'Package updated successfully!',
      package: pkg
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin delete package
// @route   DELETE /api/admin/packages/:id
// @access  Private (Admin)
exports.adminDeletePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Package deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
