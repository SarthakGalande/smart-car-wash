const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const contactController = require('../controllers/contactController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { ROLES } = require('../config/constants');

// All admin routes require authentication and ADMIN role
router.use(protect, authorize(ROLES.ADMIN));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/bookings', adminController.getAllBookings);
router.put('/bookings/:id/status', adminController.updateBookingStatus);
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/status', adminController.toggleUserStatus);
router.get('/reports', adminController.getReports);

// Inquiries / Contact
router.get('/contact', contactController.adminGetMessages);
router.put('/contact/:id', contactController.adminUpdateMessage);

module.exports = router;
