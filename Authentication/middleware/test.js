const nodemailer = require('nodemailer');
/*Replace 'your-email@gmail.com' and 'your-email-password' with your actual email credentials,
 and 'recipient-email@example.com' with email address you want to send the test email to. */
async function sendTestEmail() {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
      }
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: 'recipient-email@example.com',
      subject: 'Test Email',
      text: 'This is a test email to verify the email configuration.'
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending test email:', error);
  }
}

sendTestEmail();