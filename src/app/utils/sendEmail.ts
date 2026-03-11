import nodemailer from 'nodemailer';
import config from '../config';

const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      user: 'vivianrionmarandi@gmail.com',
      pass: 'zofr bgtr ikfv mcrc',
    },
  });
  await transporter.sendMail({
    from: 'vivianrionmarandi@gmail.com',
    to,
    subject: 'Password Reset Link',
    text: 'Hello world?',
    html,
  });
};

export default sendEmail;
