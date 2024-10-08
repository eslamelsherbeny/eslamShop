const noadMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = noadMailer.createTransport({
    host: process.env.Email_HOST,
    auth: {
      user: process.env.Email_USER,
      pass: process.env.Email_PASSWORD,
    },
  });
  const mailOptions = {
    from: `E-Shop <${process.env.Email_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
