const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packageController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roles');
const { ROLES } = require('../config/constants');

router.get('/', packageController.getPackages);
router.get('/:id', packageController.getPackageById);

// Admin Package routes
router.post('/admin', protect, authorize(ROLES.ADMIN), packageController.adminCreatePackage);
router.put('/admin/:id', protect, authorize(ROLES.ADMIN), packageController.adminUpdatePackage);
router.delete('/admin/:id', protect, authorize(ROLES.ADMIN), packageController.adminDeletePackage);

module.exports = router;
