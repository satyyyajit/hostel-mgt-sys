import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import Student from '@/models/UserModels/Student';
import { NextRequest, NextResponse } from 'next/server';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

export const POST = async (req, res) => {
        const { email } = await req.json();

        const student = await Student
            .findOne({ email })
            .select('studentId email');

        if (!student) {
            return NextResponse.error(new Error('Student not found'), 404);
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        const token = jwt.sign({ email, otp }, process.env.JWT_SECRET, { expiresIn: '20m' });

        const mailOptions = {
            from: process.env.EMAIL,
            to: 'satyajeetsjp299@gmail.com',
            subject: 'Password Reset OTP',
            text: `Your OTP is ${otp}`
        };

        try {
            await transporter.sendMail(mailOptions);
            return Response.json({ message: 'OTP sent successfully', token });
        } catch (error) {
            return Response.json({ message: 'Failed to send OTP' }, { status: 500 });
        }

        

};