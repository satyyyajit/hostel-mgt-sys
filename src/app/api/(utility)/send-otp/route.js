import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export async function POST(request) {
  const { email } = await request.json();

  console.log('EMAIL_USER:', process.env.EMAIL); // Debugging

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const token = jwt.sign({ email, otp }, process.env.JWT_SECRET, { expiresIn: '5m' });

  // Send OTP
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ message: 'OTP sent successfully', token }), {
      status: 200,
    });
  } catch (error) {
    console.error('Email sending error:', error);
    return new Response(JSON.stringify({ message: 'Failed to send OTP', error: error.message }), {
      status: 500,
    });
  }
}
