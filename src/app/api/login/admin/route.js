import connectDb from '@/lib/db';
import Admin from '@/models/UserModels/Admin';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(req) {
    await connectDb();

    try {
        const body = await req.json();
        const { empId, password } = body;

        // console.log(body);              // Log the request body
        // Validate input
        if (!empId || !password) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Employee ID and password are required.' }),
                { status: 400 }
            );
        }

        // Find admin by empId
        const admin = await Admin.findOne({ empId });
        if (!admin) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Invalid credentials.' }),
                { status: 400 }
            );
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Invalid credentials.' }),
                { status: 400 }
            );
        }

        // Create JWT
        const token = jwt.sign({ 
            id: admin._id,
            empId: admin.empId,
            role: admin.role,
            
        }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // Set the token in a cookie
        const cookie = serialize('token', token, {
            httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
            sameSite: 'strict', // Prevent CSRF attacks
            maxAge: 60 * 60, 
            path: '/',
        });

        // Return response with the cookie header
        const response = new NextResponse(
            JSON.stringify({ success: true, message: 'Login successful.' }),
            { status: 200 }
        );
        response.headers.set('Set-Cookie', cookie);
        return response;
    } catch (error) {
        return new NextResponse(
            JSON.stringify({ success: false, message: error.message }),
            { status: 500 }         
        );
    }                                                                                                   
}       
                                                                                                                                                                                                                                                                                                                                                                                                        