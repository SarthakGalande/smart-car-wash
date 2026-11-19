const TimeSlot = require('../models/TimeSlot');
const WashCenter = require('../models/WashCenter');

const DEFAULT_SLOTS = [
  { startTime: '08:00 AM', endTime: '09:00 AM' },
  { startTime: '09:00 AM', endTime: '10:00 AM' },
  { startTime: '10:00 AM', endTime: '11:00 AM' },
  { startTime: '11:00 AM', endTime: '12:00 PM' },
  { startTime: '12:00 PM', endTime: '01:00 PM' },
  { startTime: '02:00 PM', endTime: '03:00 PM' },
  { startTime: '03:00 PM', endTime: '04:00 PM' },
  { startTime: '04:00 PM', endTime: '05:00 PM' },
  { startTime: '05:00 PM', endTime: '06:00 PM' },
  { startTime: '06:00 PM', endTime: '07:00 PM' }
];

// Helper to convert "09:00 AM" into minutes from midnight
const timeToMinutes = (timeStr) => {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

// @desc    Get real-time slot availability for a center on a specific date
// @route   GET /api/availability?centerId=...&date=YYYY-MM-DD
// @access  Public
exports.getAvailability = async (req, res, next) => {
  try {
    const { centerId, date } = req.query;

    if (!centerId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Both centerId and date (YYYY-MM-DD) are required.'
      });
    }

    // Validate center exists
    const center = await WashCenter.findById(centerId);
    if (!center) {
      return res.status(404).json({ success: false, message: 'Wash center not found' });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    if (date < todayStr) {
      return res.status(400).json({
        success: false,
        message: 'Cannot check availability or book appointments for past dates.'
      });
    }

    // Find existing slot documents in DB
    let existingSlots = await TimeSlot.find({ center: centerId, date });

    // If slots not yet generated for this date, create them with center capacity
    if (existingSlots.length === 0) {
      const slotsToCreate = DEFAULT_SLOTS.map((s) => ({
        center: centerId,
        date,
        startTime: s.startTime,
        endTime: s.endTime,
        capacity: center.capacityPerSlot || 3,
        bookedCount: 0,
        isBlocked: false
      }));

      try {
        existingSlots = await TimeSlot.insertMany(slotsToCreate, { ordered: false });
      } catch (insertErr) {
        // In case of parallel request collision, fetch the newly created ones
        existingSlots = await TimeSlot.find({ center: centerId, date });
      }
    }

    // Sort slots by start time
    existingSlots.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

    // Determine current time to mark passed slots if date is today
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const isToday = date === todayStr;

    const formattedSlots = existingSlots.map((slot) => {
      const slotMinutes = timeToMinutes(slot.startTime);
      const isPast = isToday && slotMinutes <= currentMinutes;
      const remainingSpots = Math.max(0, slot.capacity - slot.bookedCount);
      const isAvailable = !isPast && !slot.isBlocked && remainingSpots > 0;

      return {
        id: slot._id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        timeSlot: `${slot.startTime} - ${slot.endTime}`,
        capacity: slot.capacity,
        bookedCount: slot.bookedCount,
        remainingSpots,
        isAvailable,
        isBlocked: slot.isBlocked,
        isPast
      };
    });

    res.status(200).json({
      success: true,
      centerId,
      centerName: center.centerName,
      date,
      slots: formattedSlots
    });
  } catch (error) {
    next(error);
  }
};
