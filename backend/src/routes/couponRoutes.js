const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { ROLES } = require('../config/constants');

router.post('/validate', couponController.validateCoupon);

// Admin Coupon Routes
router.get('/admin', protect, authorize(ROLES.ADMIN), couponController.adminGetCoupons);
router.post('/admin', protect, authorize(ROLES.ADMIN), couponController.adminCreateCoupon);
router.put('/admin/:id/toggle', protect, authorize(ROLES.ADMIN), couponController.adminToggleCoupon);

module.exports = router;
