const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { createBookingValidation, rescheduleValidation } = require('../validators/bookingValidators');

router.use(protect);

router.route('/')
  .post(createBookingValidation, bookingController.createBooking)
  .get(bookingController.getMyBookings);

router.get('/:id', bookingController.getBookingById);
router.get('/:id/invoice', bookingController.getBookingInvoice);
router.put('/:id/cancel', bookingController.cancelBooking);
router.put('/:id/reschedule', rescheduleValidation, bookingController.rescheduleBooking);

module.exports = router;
