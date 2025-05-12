const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.eu",
  port: 465,
  secure: true, // true for port 465
  auth: {
    user: process.env.EMAIL_USER, // this is email address
    pass: process.env.EMAIL_PASS, // this is app password for email address
  },
});

const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"TuulilasiKalenteri" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
