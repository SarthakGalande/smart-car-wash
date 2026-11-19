const ContactMessage = require('../models/ContactMessage');

// @desc    Submit contact message / inquiry
// @route   POST /api/contact
// @access  Public
exports.submitMessage = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const contact = await ContactMessage.create({
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      subject,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Our support team will get back to you shortly.',
      contactId: contact._id
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin get all contact messages
// @route   GET /api/admin/contact
// @access  Private (Admin)
exports.adminGetMessages = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;

    const messages = await ContactMessage.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin update inquiry status or add notes
// @route   PUT /api/admin/contact/:id
// @access  Private (Admin)
exports.adminUpdateMessage = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const update = {};
    if (status) update.status = status;
    if (adminNotes) {
      update.adminNotes = adminNotes;
      update.repliedAt = new Date();
    }

    const message = await ContactMessage.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Message status updated.',
      contactMessage: message
    });
  } catch (error) {
    next(error);
  }
};
