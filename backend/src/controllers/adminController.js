const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const Package = require('../models/Package');
const Payment = require('../models/Payment');
const TimeSlot = require('../models/TimeSlot');
const Notification = require('../models/Notification');
const { BOOKING_STATUS, PAYMENT_STATUS, ROLES, NOTIFICATION_TYPES } = require('../config/constants');

// @desc    Get aggregated admin dashboard overview statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    const monthStr = firstDayOfMonth.toISOString().split('T')[0];

    const [
      totalCustomers,
      totalVehicles,
      totalBookings,
      todayBookings,
      pendingBookings,
      completedBookings,
      cancelledBookings,
      revenueResult,
      monthRevenueResult,
      recentBookings
    ] = await Promise.all([
      User.countDocuments({ role: ROLES.CUSTOMER }),
      Vehicle.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ bookingDate: todayStr }),
      Booking.countDocuments({ bookingStatus: BOOKING_STATUS.PENDING }),
      Booking.countDocuments({ bookingStatus: BOOKING_STATUS.COMPLETED }),
      Booking.countDocuments({ bookingStatus: BOOKING_STATUS.CANCELLED }),
      Booking.aggregate([
        { $match: { bookingStatus: { $ne: BOOKING_STATUS.CANCELLED } } },
        { $group: { _id: null, total: { $sum: '$finalAmount' } } }
      ]),
      Booking.aggregate([
        {
          $match: {
            bookingDate: { $gte: monthStr },
            bookingStatus: { $ne: BOOKING_STATUS.CANCELLED }
          }
        },
        { $group: { _id: null, total: { $sum: '$finalAmount' } } }
      ]),
      Booking.find()
        .populate('user', 'fullName email phone')
        .populate('package', 'packageName')
        .populate('center', 'centerName')
        .sort({ createdAt: -1 })
        .limit(8)
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    const monthlyRevenue = monthRevenueResult.length > 0 ? monthRevenueResult[0].total : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalCustomers,
        totalVehicles,
        totalBookings,
        todayBookings,
        pendingBookings,
        completedBookings,
        cancelledBookings,
        totalRevenue: Math.round(totalRevenue),
        monthlyRevenue: Math.round(monthlyRevenue)
      },
      recentBookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings with extensive admin filters
// @route   GET /api/admin/bookings
// @access  Private (Admin)
exports.getAllBookings = async (req, res, next) => {
  try {
    const { status, search, date, centerId, page = 1, limit = 25 } = req.query;
    let query = {};

    if (status && status !== 'ALL') {
      query.bookingStatus = status;
    }

    if (date) {
      query.bookingDate = date;
    }

    if (centerId) {
      query.center = centerId;
    }

    if (search) {
      query.$or = [
        { bookingReference: { $regex: search, $options: 'i' } },
        { 'vehicleSnapshot.registrationNumber': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('user', 'fullName email phone')
        .populate('package', 'packageName price')
        .populate('center', 'centerName address city')
        .populate('vehicle')
        .sort({ createdAt: -1 })
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

// @desc    Update booking status (Confirm, In Progress, Complete, Cancel)
// @route   PUT /api/admin/bookings/:id/status
// @access  Private (Admin)
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    if (!Object.values(BOOKING_STATUS).includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${Object.values(BOOKING_STATUS).join(', ')}`
      });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    const oldStatus = booking.bookingStatus;
    booking.bookingStatus = status;
    if (notes) booking.notes = notes;

    if (status === BOOKING_STATUS.COMPLETED && booking.paymentMethod === 'CASH') {
      booking.paymentStatus = PAYMENT_STATUS.PAID;
    }

    if (status === BOOKING_STATUS.CANCELLED && oldStatus !== BOOKING_STATUS.CANCELLED) {
      if (booking.slot) {
        await TimeSlot.findByIdAndUpdate(booking.slot, { $inc: { bookedCount: -1 } });
      }
      booking.cancelledAt = new Date();
    }

    await booking.save();

    // Trigger Notification to customer
    let notifTitle = `Booking Status: ${status}`;
    let notifMsg = `Your booking #${booking.bookingReference} has been updated to ${status}.`;
    if (status === BOOKING_STATUS.IN_PROGRESS) {
      notifTitle = 'Wash In Progress! 🧽';
      notifMsg = `Your vehicle is currently being serviced at our center.`;
    } else if (status === BOOKING_STATUS.COMPLETED) {
      notifTitle = 'Vehicle Ready! ✨🚗';
      notifMsg = `Your car wash has been completed. Enjoy your sparkling clean ride! Don't forget to leave a review.`;
    }

    await Notification.create({
      user: booking.user,
      title: notifTitle,
      message: notifMsg,
      type: NOTIFICATION_TYPES.STATUS_UPDATE,
      link: '/dashboard/my-bookings'
    });

    res.status(200).json({
      success: true,
      message: `Booking #${booking.bookingReference} status updated to ${status}.`,
      booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered users / customers
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { search, role, status } = req.query;
    let query = {};

    if (role) query.role = role;
    if (status) query.status = status;

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user status (Active / Inactive / Suspended)
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === ROLES.ADMIN) {
      return res.status(400).json({ success: false, message: 'Cannot deactivate an administrator account.' });
    }

    user.status = status || (user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE');
    await user.save();

    res.status(200).json({
      success: true,
      message: `User status changed to ${user.status}.`,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reports & Analytics
// @route   GET /api/admin/reports
// @access  Private (Admin)
exports.getReports = async (req, res, next) => {
  try {
    // 1. Revenue Trends by day (last 14 days)
    const dailyRevenue = await Booking.aggregate([
      { $match: { bookingStatus: { $ne: BOOKING_STATUS.CANCELLED } } },
      {
        $group: {
          _id: '$bookingDate',
          revenue: { $sum: '$finalAmount' },
          bookingsCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 14 }
    ]);

    // 2. Package breakdown
    const packageStats = await Booking.aggregate([
      { $match: { package: { $ne: null } } },
      {
        $group: {
          _id: '$package',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$finalAmount' }
        }
      },
      {
        $lookup: {
          from: 'packages',
          localField: '_id',
          foreignField: '_id',
          as: 'packageDetails'
        }
      },
      { $unwind: '$packageDetails' },
      {
        $project: {
          name: '$packageDetails.packageName',
          count: 1,
          totalRevenue: 1
        }
      },
      { $sort: { count: -1 } }
    ]);

    // 3. Booking Status breakdown
    const statusStats = await Booking.aggregate([
      {
        $group: {
          _id: '$bookingStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // 4. Vehicle Type breakdown
    const vehicleTypeStats = await Booking.aggregate([
      {
        $group: {
          _id: '$vehicleSnapshot.vehicleType',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      dailyRevenue,
      packageStats,
      statusStats,
      vehicleTypeStats
    });
  } catch (error) {
    next(error);
  }
};
