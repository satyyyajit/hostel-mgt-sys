import Student from "@/models/UserModels/Student";
import jwt from "jsonwebtoken";
import connectDb from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req) => {
    try {
        // Connect to the database
        await connectDb();

        // Extract token from cookies
        const cookieHeader = req.headers.get('cookie');
        if (!cookieHeader) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'No cookie found.' }),
                { status: 401 }
            );
        }

        const token = cookieHeader.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        if (!token) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Token not found in cookie.' }),
                { status: 401 }
            );
        }

        // Verify JWT token
        if (!process.env.JWT_SECRET) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'JWT secret key is not set.' }),
                { status: 500 }
            );
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Invalid or expired token.' }),
                { status: 401 }
            );
        }

        const studentId = decoded.studentId;

        // Find the student
        const student = await Student.findOne({ studentId });
        if (!student) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Student not found.' }),
                { status: 404 }
            );
        }

        // Parse request body
        const body = await req.json();
        const { oldPassword, newPassword } = body;

        // Validate request body
        if (!oldPassword || !newPassword) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Old password and new password are required.' }),
                { status: 400 }
            );
        }

        // // Validate new password length and complexity
        // if (newPassword.length < 8) {
        //     return new NextResponse(
        //         JSON.stringify({ success: false, message: 'New password must be at least 8 characters long.' }),
        //         { status: 400 }
        //     );
        // }

        // Check if old password matches
        const isPasswordValid = await student.comparePassword(oldPassword);
        if (!isPasswordValid) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Old password is incorrect.' }),
                { status: 401 }
            );
        }

        // Update password
        student.password = newPassword; // Ensure the Student model hashes the password before saving
        await student.save();

        return new NextResponse(
            JSON.stringify({ success: true, message: 'Password updated successfully.' }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error in POST /api/student/change-password:', error);
        return new NextResponse(
            JSON.stringify({ success: false, message: 'Internal server error.' }),
            { status: 500 }
        );
    }
};