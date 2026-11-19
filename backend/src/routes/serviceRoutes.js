const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { ROLES } = require('../config/constants');

router.get('/', serviceController.getServices);
router.get('/:id', serviceController.getServiceById);

// Admin Service routes
router.post('/admin', protect, authorize(ROLES.ADMIN), serviceController.adminCreateService);
router.put('/admin/:id', protect, authorize(ROLES.ADMIN), serviceController.adminUpdateService);
router.delete('/admin/:id', protect, authorize(ROLES.ADMIN), serviceController.adminDeleteService);

module.exports = router;
