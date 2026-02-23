const nodemailer = require('nodemailer');

/**
 * Send an email.
 * @param {Object} options
 * @param {string} options.email   - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Plain-text body
 */
const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define mail options
  const mailOptions = {
    from: `Book Tour App <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
