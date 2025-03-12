import Student from '@/models/UserModels/Student';
import connectDb from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(req) {
    await connectDb();

    try {
        const body = await req.json();
        // console.log('Request Body:', body);

        const { studentId, password } = body;

        // Validate inputs
        if (!studentId || !password) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Student ID and password are required.' }),
                { status: 400 }
            );
        }

        // Find the student by studentId
        const student = await Student.findOne({ studentId });

        if (!student) {
            console.log('Student not found');
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Student not found.' }),
                { status: 404 }
            );
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, student.password);

        if (!isMatch) {
            console.log('Password does not match');
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Invalid password!' }),
                { status: 400 }
            );
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: student._id, role: student.role, studentId: student.studentId },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Set cookie
        const cookie = serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict',
            maxAge: 60 * 60, 
            path: '/', 
        });

        // Create the response
        const response = NextResponse.json(
            { success: true, message: 'Login successful.', token: token, student: student },
            { status: 200 }
        );

        // Set the cookie in the response headers
        response.headers.set('Set-Cookie', cookie);

        return response;
    } catch (err) {
        console.error('Error in login API:', err);
        return new NextResponse(
            JSON.stringify({ success: false, message: err.message || 'Internal server error' }),
            { status: 500 }
        );
    }
}