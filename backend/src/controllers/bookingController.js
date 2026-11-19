const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const Service = require('../models/Service');
const Package = require('../models/Package');
const WashCenter = require('../models/WashCenter');
const TimeSlot = require('../models/TimeSlot');
const Coupon = require('../models/Coupon');
const CouponUsage = require('../models/CouponUsage');
const Notification = require('../models/Notification');
const Payment = require('../models/Payment');
const { BOOKING_STATUS, PAYMENT_STATUS, PAYMENT_METHODS, NOTIFICATION_TYPES } = require('../config/constants');

// Generate unique booking reference
const generateBookingReference = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `SCW-${timestamp}${random}`;
};

// @desc    Create a new car wash booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const {
      vehicleId,
      centerId,
      packageId,
      serviceIds,
      bookingDate,
      timeSlot,
      slotId,
      couponCode,
      paymentMethod,
      notes
    } = req.body;

    // 1. Validate date is not in past
    const todayStr = new Date().toISOString().split('T')[0];
    if (bookingDate < todayStr) {
      return res.status(400).json({
        success: false,
        message: 'Cannot schedule bookings for past dates.'
      });
    }

    // 2. Validate Vehicle belongs to logged in user
    const vehicle = await Vehicle.findOne({ _id: vehicleId, user: req.user._id });
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Selected vehicle not found or does not belong to your account.'
      });
    }

    // 3. Validate Wash Center
    const center = await WashCenter.findById(centerId);
    if (!center || center.status !== 'ACTIVE') {
      return res.status(404).json({
        success: false,
        message: 'Selected wash center is currently unavailable.'
      });
    }

    // 4. Validate or lookup TimeSlot and atomically reserve capacity
    let selectedSlotDoc = null;
    if (slotId) {
      selectedSlotDoc = await TimeSlot.findById(slotId);
    } else {
      const [start] = timeSlot.split(' - ');
      selectedSlotDoc = await TimeSlot.findOne({ center: centerId, date: bookingDate, startTime: start.trim() });
    }

    if (!selectedSlotDoc) {
      return res.status(400).json({
        success: false,
        message: 'The requested time slot does not exist for this center and date.'
      });
    }

    // Atomic update to reserve slot: only succeeds if bookedCount < capacity and not blocked
    const reservedSlot = await TimeSlot.findOneAndUpdate(
      {
        _id: selectedSlotDoc._id,
        $expr: { $lt: ['$bookedCount', '$capacity'] },
        isBlocked: false
      },
      { $inc: { bookedCount: 1 } },
      { new: true }
    );

    if (!reservedSlot) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is fully booked or unavailable. Please choose another slot.'
      });
    }

    // 5. Secure Server-Side Price Calculation (Never trust client prices)
    let packageDoc = null;
    let packagePrice = 0;
    if (packageId) {
      packageDoc = await Package.findById(packageId);
      if (packageDoc && packageDoc.status === 'ACTIVE') {
        packagePrice = packageDoc.price;
      }
    }

    let servicesPrice = 0;
    const servicesList = [];
    if (Array.isArray(serviceIds) && serviceIds.length > 0) {
      const foundServices = await Service.find({ _id: { $in: serviceIds }, status: 'ACTIVE' });
      for (const s of foundServices) {
        servicesPrice += s.price;
        servicesList.push({
          service: s._id,
          serviceName: s.serviceName,
          price: s.price
        });
      }
    }

    // Must have at least a package or one service
    if (packagePrice === 0 && servicesPrice === 0) {
      // Rollback slot reservation
      await TimeSlot.findByIdAndUpdate(selectedSlotDoc._id, { $inc: { bookedCount: -1 } });
      return res.status(400).json({
        success: false,
        message: 'Please select at least one package or service for your booking.'
      });
    }

    const basePrice = packagePrice + servicesPrice;
    const taxRate = Number(process.env.TAX_RATE_PERCENT || 18);
    const taxAmount = Math.round((basePrice * (taxRate / 100)) * 100) / 100;

    // 6. Coupon Discount Calculation
    let discountAmount = 0;
    let appliedCouponDoc = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.trim().toUpperCase() });
      if (coupon && coupon.isValidForAmount(basePrice)) {
        discountAmount = coupon.calculateDiscount(basePrice);
        appliedCouponDoc = coupon;
        // Increment coupon usage
        await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
      }
    }

    const finalAmount = Math.max(0, Math.round((basePrice + taxAmount - discountAmount) * 100) / 100);

    // 7. Create Booking Document
    const bookingReference = generateBookingReference();

    const booking = await Booking.create({
      bookingReference,
      user: req.user._id,
      vehicle: vehicle._id,
      vehicleSnapshot: {
        brand: vehicle.brand,
        model: vehicle.model,
        registrationNumber: vehicle.registrationNumber,
        vehicleType: vehicle.vehicleType,
        color: vehicle.color
      },
      center: center._id,
      package: packageDoc ? packageDoc._id : null,
      services: servicesList,
      slot: reservedSlot._id,
      bookingDate,
      timeSlot,
      basePrice,
      packagePrice,
      servicesPrice,
      discountAmount,
      taxAmount,
      finalAmount,
      couponApplied: appliedCouponDoc ? appliedCouponDoc._id : null,
      bookingStatus: BOOKING_STATUS.CONFIRMED,
      paymentStatus: paymentMethod === PAYMENT_METHODS.CASH ? PAYMENT_STATUS.PENDING : PAYMENT_STATUS.PENDING,
      paymentMethod: paymentMethod || PAYMENT_METHODS.CASH,
      notes: notes || ''
    });

    // Record coupon usage if applied
    if (appliedCouponDoc) {
      await CouponUsage.create({
        coupon: appliedCouponDoc._id,
        user: req.user._id,
        booking: booking._id,
        discountApplied: discountAmount
      });
    }

    // 8. Trigger Notification
    await Notification.create({
      user: req.user._id,
      title: 'Booking Confirmed! 🚗🎉',
      message: `Your booking #${bookingReference} is confirmed for ${bookingDate} (${timeSlot}) at ${center.centerName}. Total: ₹${finalAmount}.`,
      type: NOTIFICATION_TYPES.BOOKING_CONFIRMED,
      link: `/dashboard/my-bookings`
    });

    // Populate relations for response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('center', 'centerName address city phone')
      .populate('package', 'packageName price')
      .populate('vehicle');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully!',
      booking: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's bookings with filters
// @route   GET /api/bookings
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const { status, filter, page = 1, limit = 20 } = req.query;
    let query = { user: req.user._id };

    const todayStr = new Date().toISOString().split('T')[0];

    if (filter === 'upcoming') {
      query.bookingDate = { $gte: todayStr };
      query.bookingStatus = { $in: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.PENDING, BOOKING_STATUS.IN_PROGRESS] };
    } else if (filter === 'completed') {
      query.bookingStatus = BOOKING_STATUS.COMPLETED;
    } else if (filter === 'cancelled') {
      query.bookingStatus = BOOKING_STATUS.CANCELLED;
    } else if (status) {
      query.bookingStatus = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('center', 'centerName address city phone')
        .populate('package', 'packageName price')
        .populate('vehicle')
        .sort({ bookingDate: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Booking.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking details by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res, next) => {
  try {
    const query = req.user.role === 'ADMIN'
      ? { _id: req.params.id }
      : { _id: req.params.id, user: req.user._id };

    const booking = await Booking.findOne(query)
      .populate('user', 'fullName email phone address')
      .populate('center', 'centerName address city phone email')
      .populate('package', 'packageName description price duration features')
      .populate('vehicle')
      .populate('services.service', 'serviceName price duration category');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or you do not have permission to view it.'
      });
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const query = req.user.role === 'ADMIN'
      ? { _id: req.params.id }
      : { _id: req.params.id, user: req.user._id };

    const booking = await Booking.findOne(query);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.'
      });
    }

    if (booking.bookingStatus === BOOKING_STATUS.CANCELLED) {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been cancelled.'
      });
    }

    if (booking.bookingStatus === BOOKING_STATUS.COMPLETED) {
      return res.status(400).json({
        success: false,
        message: 'Completed bookings cannot be cancelled.'
      });
    }

    // Release time slot capacity
    if (booking.slot) {
      await TimeSlot.findByIdAndUpdate(booking.slot, {
        $inc: { bookedCount: -1 }
      });
    }

    booking.bookingStatus = BOOKING_STATUS.CANCELLED;
    booking.cancellationReason = reason || 'Cancelled by customer';
    booking.cancelledAt = new Date();

    if (booking.paymentStatus === PAYMENT_STATUS.PAID) {
      booking.paymentStatus = PAYMENT_STATUS.REFUNDED;
    }

    await booking.save();

    // Trigger notification
    await Notification.create({
      user: booking.user,
      title: 'Booking Cancelled ℹ️',
      message: `Your booking #${booking.bookingReference} for ${booking.bookingDate} has been cancelled.${booking.paymentStatus === PAYMENT_STATUS.REFUNDED ? ' A refund has been initiated to your original payment method.' : ''}`,
      type: NOTIFICATION_TYPES.BOOKING_CANCELLED,
      link: '/dashboard/my-bookings'
    });

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully.',
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reschedule a booking to a new date and time slot
// @route   PUT /api/bookings/:id/reschedule
// @access  Private
exports.rescheduleBooking = async (req, res, next) => {
  try {
    const { newDate, newTimeSlot, newSlotId } = req.body;

    const todayStr = new Date().toISOString().split('T')[0];
    if (newDate < todayStr) {
      return res.status(400).json({
        success: false,
        message: 'Cannot reschedule to a past date.'
      });
    }

    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.'
      });
    }

    if ([BOOKING_STATUS.COMPLETED, BOOKING_STATUS.CANCELLED].includes(booking.bookingStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot reschedule a ${booking.bookingStatus.toLowerCase()} booking.`
      });
    }

    // Lookup new slot
    let newSlotDoc = null;
    if (newSlotId) {
      newSlotDoc = await TimeSlot.findById(newSlotId);
    } else {
      const [start] = newTimeSlot.split(' - ');
      newSlotDoc = await TimeSlot.findOne({ center: booking.center, date: newDate, startTime: start.trim() });
    }

    if (!newSlotDoc) {
      return res.status(400).json({
        success: false,
        message: 'Requested slot is not available for this date.'
      });
    }

    // Atomically reserve new slot
    const reservedNewSlot = await TimeSlot.findOneAndUpdate(
      {
        _id: newSlotDoc._id,
        $expr: { $lt: ['$bookedCount', '$capacity'] },
        isBlocked: false
      },
      { $inc: { bookedCount: 1 } },
      { new: true }
    );

    if (!reservedNewSlot) {
      return res.status(409).json({
        success: false,
        message: 'The selected rescheduled slot is already fully booked. Please choose another.'
      });
    }

    // Release old slot capacity
    if (booking.slot) {
      await TimeSlot.findByIdAndUpdate(booking.slot, { $inc: { bookedCount: -1 } });
    }

    // Update booking
    booking.rescheduledFrom = {
      date: booking.bookingDate,
      timeSlot: booking.timeSlot
    };
    booking.bookingDate = newDate;
    booking.timeSlot = newTimeSlot;
    booking.slot = reservedNewSlot._id;
    booking.bookingStatus = BOOKING_STATUS.CONFIRMED;

    await booking.save();

    // Trigger notification
    await Notification.create({
      user: req.user._id,
      title: 'Booking Rescheduled 📅',
      message: `Your booking #${booking.bookingReference} has been rescheduled to ${newDate} at ${newTimeSlot}.`,
      type: NOTIFICATION_TYPES.BOOKING_RESCHEDULED,
      link: '/dashboard/my-bookings'
    });

    res.status(200).json({
      success: true,
      message: 'Booking rescheduled successfully!',
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get printable / downloadable booking invoice
// @route   GET /api/bookings/:id/invoice
// @access  Private
exports.getBookingInvoice = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id })
      .populate('user', 'fullName email phone address')
      .populate('center', 'centerName address city phone email')
      .populate('package', 'packageName price')
      .populate('services.service', 'serviceName price')
      .populate('vehicle');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }

    const invoiceData = {
      invoiceNumber: `INV-${booking.bookingReference}`,
      invoiceDate: booking.createdAt,
      bookingReference: booking.bookingReference,
      customer: {
        name: booking.user.fullName,
        email: booking.user.email,
        phone: booking.user.phone,
        address: booking.user.address
      },
      center: booking.center,
      vehicle: booking.vehicleSnapshot || booking.vehicle,
      appointment: {
        date: booking.bookingDate,
        time: booking.timeSlot
      },
      lineItems: [
        ...(booking.package ? [{ description: `Package: ${booking.package.packageName}`, amount: booking.packagePrice }] : []),
        ...(booking.services || []).map((s) => ({
          description: s.serviceName,
          amount: s.price
        }))
      ],
      pricing: {
        basePrice: booking.basePrice,
        taxRatePercent: 18,
        taxAmount: booking.taxAmount,
        discountAmount: booking.discountAmount,
        totalAmount: booking.finalAmount
      },
      payment: {
        method: booking.paymentMethod,
        status: booking.paymentStatus
      },
      status: booking.bookingStatus
    };

    res.status(200).json({
      success: true,
      invoice: invoiceData
    });
  } catch (error) {
    next(error);
  }
};
