const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  // host: "smtp.gmail.com",
  // port: 587,
  // secure: false,
  auth: {
    user: process.env.EMAIL_SENDER,
    pass: process.env.PASSWORD_SENDER,
  },

});

async function mailSender(toEmail, otp) {
  try {
    const info = await transporter.sendMail({
      from: '"DatingApp OTP sender" <soulmate.rjb@gmail.com>',
      to: toEmail,
      subject: "OTP for Dating app verification",
      text: `You requested OTP from Dating App your OTP is : ${otp}`,
    });

    console.log(`otp sent: ${info.messageId}`);
  } catch (error) {
    console.error("Error sending otp:", error);
  }
}

module.exports = mailSender;
