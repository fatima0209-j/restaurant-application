const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const { verifyToken } = require("../middleware/authAdmin");
const Reservation = require("../models/Reservation");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();


router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ username, password: hash });
    res.json({ success: true, message: "Admin registered", data: admin });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


router.get("/reservations", verifyToken, async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json({ success: true, data: reservations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/reservations/:id/approve", verifyToken, async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    );

    if (!reservation) return res.status(404).json({ success: false, message: "Reservation not found" });

    // send approval email
    await sendEmail(
      reservation.email,
      "Reservation Approved",
      `Hello ${reservation.name}, your reservation for ${reservation.date} at ${reservation.time} has been approved.`
    );

    res.json({ success: true, message: "Reservation approved", data: reservation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
