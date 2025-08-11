const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const authAdmin = require('../middleware/authAdmin');
const Reservation = require('../models/Reservation');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();

// Admin register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ username, password: hash });
    res.json({ success: true, message: 'Admin registered' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Admin login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin) return res.json({ success: false, message: 'Invalid credentials' });
  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.json({ success: false, message: 'Invalid credentials' });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ success: true, token });
});

// Get all reservations
router.get('/reservations', authAdmin, async (req, res) => {
  const reservations = await Reservation.find().sort({ createdAt: -1 });
  res.json({ success: true, data: reservations });
});

// Approve reservation
router.put('/reservations/:id/approve', authAdmin, async (req, res) => {
  const reservation = await Reservation.findByIdAndUpdate(
    req.params.id,
    { status: 'Approved' },
    { new: true }
  );

  if (reservation) {
    await sendEmail(
      reservation.email,
      'Your Reservation is Approved',
      `Hello ${reservation.name},\n\nYour reservation for ${reservation.date} at ${reservation.time} is approved.\n\nThank you!`
    );
    res.json({ success: true, message: 'Reservation approved and email sent' });
  } else {
    res.status(404).json({ success: false, message: 'Reservation not found' });
  }
});

module.exports = router;
