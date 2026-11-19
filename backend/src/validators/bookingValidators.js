const { check } = require('express-validator');
const { validate } = require('./authValidators');

const createBookingValidation = [
  check('vehicleId', 'Vehicle ID is required').isMongoId(),
  check('centerId', 'Wash center ID is required').isMongoId(),
  check('bookingDate', 'Booking date is required (YYYY-MM-DD)').matches(/^\d{4}-\d{2}-\d{2}$/),
  check('timeSlot', 'Time slot is required').notEmpty(),
  validate
];

const rescheduleValidation = [
  check('newDate', 'New booking date is required (YYYY-MM-DD)').matches(/^\d{4}-\d{2}-\d{2}$/),
  check('newTimeSlot', 'New time slot is required').notEmpty(),
  validate
];

module.exports = {
  createBookingValidation,
  rescheduleValidation
};
