const Reservation = require("../models/Reservation");
const sendEmail = require("../utils/sendEmail");

// Helper function to format reservation
const formatReservation = (r) => ({
  ...r._doc,
  date: r.date ? new Date(r.date).toLocaleDateString("en-GB") : "",
  time: r.time || "",
});

// Create reservation (User side)
exports.createReservation = async (req, res) => {
  try {
    const reservation = new Reservation(req.body);
    await reservation.save();

    // ✅ Send confirmation email to user
    try {
      await sendEmail(
        reservation.email,
        "Reservation Confirmation",
        `Hello ${reservation.name},\n\nYour reservation has been received.\nDate: ${reservation.date}\nTime: ${reservation.time}\n\nWe will update you once it is approved or rejected.\n\nThank you.`
      );
    } catch (err) {
      console.error("User confirmation email failed:", err.message);
    }

    // ✅ Send notification email to admin
    try {
      await sendEmail(
        process.env.ADMIN_EMAIL,
        "New Reservation Received",
        `Hello Admin,\n\nYou have received a new reservation:\n\nName: ${reservation.name}\nEmail: ${reservation.email}\nPhone: ${reservation.phone}\nDate: ${reservation.date}\nTime: ${reservation.time}\nMessage: ${reservation.message || "No message"}\n\nPlease review it in the dashboard.`
      );
    } catch (err) {
      console.error("Admin notification email failed:", err.message);
    }

    res.status(201).json({ success: true, data: formatReservation(reservation) });
  } catch (err) {
    console.error("Create Reservation Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all reservations (Admin side)
exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reservations.map(formatReservation) });
  } catch (err) {
    console.error("Get Reservations Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update reservation status & send email
exports.updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!status || !["approved", "rejected"].includes(status.toLowerCase())) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    // Find and update
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: "Reservation not found" });
    }

    reservation.status = status.toLowerCase();
    await reservation.save();

    // Send email to user
    const subject = `Your reservation has been ${status}`;
    const message = `Hello ${reservation.name},\n\nYour reservation for ${reservation.date} at ${reservation.time} has been ${status}.\n\nThank you.`;

    try {
      await sendEmail(reservation.email, subject, message);
    } catch (err) {
      console.error("Email sending failed:", err.message);
    }

    res.status(200).json({ success: true, data: formatReservation(reservation) });
  } catch (err) {
    console.error("Update Reservation Status Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
