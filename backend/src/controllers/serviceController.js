const Service = require('../models/Service');

// @desc    Get all car wash services
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res, next) => {
  try {
    const { category, search, sort, status } = req.query;
    let query = {};

    // For public endpoint, default to ACTIVE only
    if (status) {
      query.status = status;
    } else {
      query.status = 'ACTIVE';
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { serviceName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { isPopular: -1, price: 1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    const services = await Service.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get service by ID or slug
// @route   GET /api/services/:id
// @access  Public
exports.getServiceById = async (req, res, next) => {
  try {
    let service;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      service = await Service.findById(req.params.id);
    } else {
      service = await Service.findOne({ slug: req.params.id });
    }

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.status(200).json({
      success: true,
      service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new service (Admin)
// @route   POST /api/admin/services
// @access  Private (Admin)
exports.adminCreateService = async (req, res, next) => {
  try {
    const { serviceName, description, price, duration, image, features, category, isPopular, status } = req.body;

    const slug = serviceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const service = await Service.create({
      serviceName,
      slug,
      description,
      price: Number(price),
      duration: Number(duration),
      image,
      features: Array.isArray(features) ? features : (features ? features.split(',').map(f => f.trim()) : []),
      category: category || 'Complete',
      isPopular: !!isPopular,
      status: status || 'ACTIVE'
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully!',
      service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service (Admin)
// @route   PUT /api/admin/services/:id
// @access  Private (Admin)
exports.adminUpdateService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const { serviceName, description, price, duration, image, features, category, isPopular, status } = req.body;

    if (serviceName) {
      service.serviceName = serviceName;
      service.slug = serviceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (description) service.description = description;
    if (price !== undefined) service.price = Number(price);
    if (duration !== undefined) service.duration = Number(duration);
    if (image) service.image = image;
    if (features) {
      service.features = Array.isArray(features) ? features : features.split(',').map(f => f.trim());
    }
    if (category) service.category = category;
    if (isPopular !== undefined) service.isPopular = !!isPopular;
    if (status) service.status = status;

    await service.save();

    res.status(200).json({
      success: true,
      message: 'Service updated successfully!',
      service
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service (Admin)
// @route   DELETE /api/admin/services/:id
// @access  Private (Admin)
exports.adminDeleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
