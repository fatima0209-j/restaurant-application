// const express = require('express');
// const router = express.Router();
// const { createReservation } = require('../controllers/reservationController');

// router.post('/', createReservation);

// module.exports = router;
// const express = require('express');
// const { createReservation } = require('../controllers/reservationController');

// const router = express.Router();

// router.post('/', createReservation);

// module.exports = router;


// backend/src/controllers/reservationController.js
// const Reservation = require('../models/Reservation');
// const sendEmail = require('../utils/sendEmail');
// const { createReservation } = require('../controllers/reservationController');
// const router = require('./adminRoutes');
// exports.createReservation = async (req, res) => {
//   try {
//     const reservation = await Reservation.create(req.body);

//     // Send email to admin
//     await sendEmail(
//       process.env.ADMIN_EMAIL,
//       'New Reservation Request',
//       `You have a new reservation from ${reservation.name} for ${reservation.date} at ${reservation.time}.`
//     );

//     res.json({ success: true, message: 'Reservation submitted successfully' });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// module.exports = router;

const express = require("express");
const {
  createReservation,
  getReservations,
  updateReservationStatus
} = require("../controllers/reservationController");

const router = express.Router();

// User: Create new reservation
router.post("/", createReservation);

// Admin: Get all reservations
router.get("/", getReservations);

// Admin: Approve/Reject reservation
router.put("/:id/status", updateReservationStatus);

module.exports = router;


