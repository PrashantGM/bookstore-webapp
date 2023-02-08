const nodemailer = require('nodemailer');

const sendResetEmail = async (email, token) => {
  let mail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.BUSINESS_EMAIL,
      pass: process.env.BUSINESS_EMAIL_PASS,
    },
  });

  let mailOptions = {
    from: process.env.BUSINESS_EMAIL,
    to: email,
    subject: 'Reset Password Link - bookstore.com',
    html: `<p>You requested for reset password.\n Kindly use this <a href="http://localhost:8000/user/reset-password?email=${email}&token=${token}"><b>link</b></a> to reset your password.</p>`,
  };

  const mailed = await mail.sendMail(mailOptions);
  if (!mailed) {
    return false;
  }
  return true;
};

module.exports = { sendResetEmail };
