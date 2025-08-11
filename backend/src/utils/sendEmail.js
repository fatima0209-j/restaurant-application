const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


module.exports = async function sendEmail(to, subject, text) {
  if (!to) {
    console.error("Email sending skipped: No recipient address provided");
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Food App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });
    console.log(`Email sent successfully to ${to}`);
  } catch (err) {
    console.error("Error sending email:", err.message);
  }
};
