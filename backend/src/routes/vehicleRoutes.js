const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(vehicleController.getVehicles)
  .post(vehicleController.addVehicle);

router.route('/:id')
  .put(vehicleController.updateVehicle)
  .delete(vehicleController.deleteVehicle);

module.exports = router;
