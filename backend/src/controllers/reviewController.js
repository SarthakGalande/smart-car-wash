const Review = require('../models/Review');
const Booking = require('../models/Booking');
const { BOOKING_STATUS } = require('../config/constants');

// @desc    Create review for completed service
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const { bookingId, rating, comment, serviceId, packageId } = req.body;

    const booking = await Booking.findOne({ _id: bookingId, user: req.user._id });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.'
      });
    }

    // Must be COMPLETED
    if (booking.bookingStatus !== BOOKING_STATUS.COMPLETED) {
      return res.status(400).json({
        success: false,
        message: 'Reviews can only be submitted for completed car wash bookings.'
      });
    }

    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this booking.'
      });
    }

    const review = await Review.create({
      user: req.user._id,
      booking: booking._id,
      service: serviceId || null,
      package: packageId || booking.package || null,
      rating: Number(rating),
      comment: comment.trim(),
      isApproved: true
    });

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'fullName')
      .populate('service', 'serviceName')
      .populate('package', 'packageName');

    res.status(201).json({
      success: true,
      message: 'Thank you for your valuable feedback!',
      review: populatedReview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public approved customer reviews
// @route   GET /api/reviews
// @access  Public
exports.getReviews = async (req, res, next) => {
  try {
    const { serviceId, packageId, limit = 10 } = req.query;
    let query = { isApproved: true };

    if (serviceId) query.service = serviceId;
    if (packageId) query.package = packageId;

    const reviews = await Review.find(query)
      .populate('user', 'fullName avatar')
      .populate('service', 'serviceName')
      .populate('package', 'packageName')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    const query = req.user.role === 'ADMIN' ? { _id: req.params.id } : { _id: req.params.id, user: req.user._id };
    const review = await Review.findOneAndDelete(query);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
