import nodemailer, { SendMailOptions } from 'nodemailer';

const sendVerificationEmail = async (
  to: string,
  verificationToken: string,
): Promise<void> => {
  //frontend url
  const baseURL = `${process.env.FRONT_END_URL}/verify`;
  const verificationLink = `${baseURL}?token=${verificationToken}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: 465,
    secure: process.env.SMTP_SECURE === 'true' || true, // SSL when using port 465
    auth: {
      user: process.env.SMTP_EMAIL, // your full email address
      pass: process.env.SMTP_PASSWORD, // email account password
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
      <p>Best regards,<br/>revourhotel/p>
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
const sendForgotPasswordEmail = async (
  to: string,
  resetToken: string,
): Promise<void> => {
  // Frontend reset password page
  const baseURL = `${process.env.FRONT_END_URL}/forgetpassword`;
  const resetLink = `${baseURL}?token=${resetToken}`;

  // const transporter: Transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //     user: process.env.SMTP_EMAIL,
  //     pass: process.env.SMTP_PASSWORD,
  //   },
  // });
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: 465,
    secure: process.env.SMTP_SECURE === 'true' || true, // SSL when using port 465
    auth: {
      user: process.env.SMTP_EMAIL, // your full email address
      pass: process.env.SMTP_PASSWORD, // email account password
    },
  });

  const mailOptions: SendMailOptions = {
    from: process.env.SMTP_EMAIL,
    to,
    subject: 'Reset Your Password',
    text: `You requested a password reset. Click the link below to reset your password: ${resetLink}`,
    html: `
      <p>Hi there,</p>
      <p>You requested to reset your password. Please click the link below to set a new password:</p>
      <p><a href="${resetLink}" target="_blank">Reset your password</a></p>
      <p>This link will expire in 1 hour. If you did not request a password reset, please ignore this email.</p>
      <p>Best regards,<br/>Revour Hotel</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending password reset email: ', error);
    throw new Error('Password reset email sending failed');
  }
};
const sendHotelRegistrationEmail = async (
  to: string,
  hotelName: string,
  email: string,
  password: string,
): Promise<void> => {
  const loginURL = `${process.env.FRONT_END_URL}/login`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: 465,
    secure: process.env.SMTP_SECURE === 'true' || true, // SSL when using port 465
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions: SendMailOptions = {
    from: process.env.SMTP_EMAIL,
    to,
    subject: 'Welcome to Revour Hotels! Your Registration is Successful ✅',
    html: `
      <p>Dear ,</p>

      <p>We are excited to welcome you to the <strong>Revour family 🎉</strong>.</p>
      <p>Your hotel has been successfully registered on our platform. You can now access your partner dashboard and start receiving bookings.</p>

      <h3>Your Login Credentials 🔑</h3>
      <p><strong>Login URL:</strong> <a href="${loginURL}" target="_blank">${loginURL}</a></p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Password:</strong> ${password}</p>
    

      <p>If you need assistance, our support team is always here to help. Just reply to this email or reach out at <a href="mailto:info@revourhotels.com">info@revourhotels.com</a>.</p>

      <p>We look forward to a strong partnership and helping your hotel attract more guests.</p>

      <p>Warm regards,<br/>
      <strong>Revour Hotel</strong><br/>
      📧 info@revourhotels.com<br/>
      🌐 <a href="https://revourhotels.com" target="_blank">revourhotels.com</a></p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Hotel registration email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending hotel registration email: ', error);
    throw new Error('Hotel registration email sending failed');
  }
};

export {
  sendVerificationEmail,
  sendForgotPasswordEmail,
  sendHotelRegistrationEmail,
};
