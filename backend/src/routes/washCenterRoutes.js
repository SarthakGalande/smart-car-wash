const express = require('express');
const router = express.Router();
const washCenterController = require('../controllers/washCenterController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { ROLES } = require('../config/constants');

router.get('/', washCenterController.getWashCenters);
router.get('/:id', washCenterController.getWashCenterById);

// Admin Center routes
router.post('/admin', protect, authorize(ROLES.ADMIN), washCenterController.adminCreateCenter);
router.put('/admin/:id', protect, authorize(ROLES.ADMIN), washCenterController.adminUpdateCenter);

module.exports = router;
