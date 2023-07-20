const nodemailer = require('nodemailer');

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  // Configure your email provider details here
  service: 'Gmail',
  auth: {
    user: 'socialsquare33@gmail.com',
    pass: 'bgabqznuyhaalpvo',
  },
});

// Controller function to send email
exports.sendOTP = (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: 'socialsquare33@gmail.com',
    to,
    subject,
    html: `
      <div style="background-color: #007bff; padding: 20px; text-align: center;">
        <h1 style="color: white; font-family: Arial;">Social Square</h1>
        <div style="background-color: white; padding: 20px;">
          <p style="font-size: 18px; font-family: Arial;">${text}</p>
        </div>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred while sending the email.' });
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'Email sent successfully.' });
    }
  });
};
