const Coupon = require('../models/Coupon');

// @desc    Validate coupon code and return discount
// @route   POST /api/coupons/validate
// @access  Public or Private
exports.validateCoupon = async (req, res, next) => {
  try {
    const { code, amount } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required.' });
    }

    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code.' });
    }

    const bookingAmount = Number(amount) || 0;
    if (!coupon.isValidForAmount(bookingAmount)) {
      if (bookingAmount < coupon.minBookingAmount) {
        return res.status(400).json({
          success: false,
          message: `This coupon requires a minimum booking amount of ₹${coupon.minBookingAmount}.`
        });
      }
      return res.status(400).json({
        success: false,
        message: 'This coupon has expired or reached its maximum usage limit.'
      });
    }

    const discount = coupon.calculateDiscount(bookingAmount);

    res.status(200).json({
      success: true,
      message: `Coupon applied! You save ₹${discount}`,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount: discount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin get all coupons
// @route   GET /api/admin/coupons
// @access  Private (Admin)
exports.adminGetCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: coupons.length,
      coupons
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin create coupon
// @route   POST /api/admin/coupons
// @access  Private (Admin)
exports.adminCreateCoupon = async (req, res, next) => {
  try {
    const { code, description, discountType, discountValue, minBookingAmount, maxDiscount, validUntil, usageLimit } = req.body;

    const coupon = await Coupon.create({
      code: code.trim().toUpperCase(),
      description,
      discountType,
      discountValue: Number(discountValue),
      minBookingAmount: Number(minBookingAmount || 0),
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      validUntil: new Date(validUntil),
      usageLimit: Number(usageLimit || 100)
    });

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully!',
      coupon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin toggle coupon status
// @route   PUT /api/admin/coupons/:id/toggle
// @access  Private (Admin)
exports.adminToggleCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    coupon.status = coupon.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await coupon.save();

    res.status(200).json({
      success: true,
      message: `Coupon marked as ${coupon.status}.`,
      coupon
    });
  } catch (error) {
    next(error);
  }
};
