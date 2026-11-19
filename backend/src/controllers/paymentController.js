const crypto = require('crypto');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const { PAYMENT_STATUS, NOTIFICATION_TYPES } = require('../config/constants');

// @desc    Create online payment order / token
// @route   POST /api/payments/create-order
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findOne({ _id: bookingId, user: req.user._id });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.paymentStatus === PAYMENT_STATUS.PAID) {
      return res.status(400).json({ success: false, message: 'This booking has already been paid for.' });
    }

    // Generate Order ID for test mode simulation or gateway
    const orderId = `order_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    res.status(200).json({
      success: true,
      orderId,
      amount: booking.finalAmount,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_sampleKey123',
      bookingReference: booking.bookingReference
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify and finalize payment
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res, next) => {
  try {
    const { bookingId, transactionId, paymentMethod, orderId, paymentId, signature } = req.body;

    const booking = await Booking.findOne({ _id: bookingId, user: req.user._id });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // In a test mode / gateway integration, we verify or accept test payment details
    const txId = transactionId || paymentId || `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const payment = await Payment.create({
      booking: booking._id,
      user: req.user._id,
      transactionId: txId,
      paymentMethod: paymentMethod || 'ONLINE',
      amount: booking.finalAmount,
      paymentStatus: PAYMENT_STATUS.PAID,
      gatewayDetails: {
        orderId,
        paymentId: paymentId || txId,
        signature
      }
    });

    // Update booking payment and booking status
    booking.paymentStatus = PAYMENT_STATUS.PAID;
    booking.paymentMethod = paymentMethod || 'ONLINE';
    await booking.save();

    // Trigger Notification
    await Notification.create({
      user: req.user._id,
      title: 'Payment Successful! 💳✅',
      message: `Payment of ₹${booking.finalAmount} received for booking #${booking.bookingReference}. Transaction ID: ${txId}.`,
      type: NOTIFICATION_TYPES.PAYMENT_SUCCESS,
      link: '/dashboard/my-bookings'
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified and recorded successfully!',
      payment,
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's payment transactions history
// @route   GET /api/payments/history
// @access  Private
exports.getPaymentHistory = async (req, res, next) => {
  try {
    const query = req.user.role === 'ADMIN' ? {} : { user: req.user._id };

    const payments = await Payment.find(query)
      .populate('booking', 'bookingReference bookingDate timeSlot finalAmount')
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    next(error);
  }
};
