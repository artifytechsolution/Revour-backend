import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';

const sendVerificationEmail = async (
  to: string,
  verificationToken: string,
): Promise<void> => {
  //frontend url
  const baseURL = 'http://localhost:3000/verify';
  const verificationLink = `${baseURL}?token=${verificationToken}`;

  const transporter: Transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions: SendMailOptions = {
    from: process.env.SMTP_EMAIL,
    to: to,
    subject: 'Verify Your Email Address',
    text: `Please verify your email address by clicking the following link: ${verificationLink}`,
    html: `
      <p>Hi there!</p>
      <p>Thank you for registering with us. To complete your registration, please click the link below to verify your email address:</p>
      <p><a href="${verificationLink}" target="_blank">Verify your email address</a></p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Best regards,<br/>keval khetani</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending verification email: ', error);
    throw new Error('Verification email sending failed');
  }
};

export default sendVerificationEmail;
