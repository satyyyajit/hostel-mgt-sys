import Student from "@/models/UserModels/Student";
import jwt from "jsonwebtoken";
import connectDb from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

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
        const { currentPassword, newPassword, confirmPassword } = await req.json();

        // Validate input fields
        if (!currentPassword || !newPassword || !confirmPassword) {
            console.log('All fields are required',);
            return NextResponse.json(
                { success: false, message: 'All fields are required.' },
                { status: 400 }
            );
        }

        if (newPassword !== confirmPassword) {
            console.log('Password not same',);
            return NextResponse.json(
                { success: false, message: 'New password and confirm password do not match.' },
                { status: 400 }
            );
        }

        if (currentPassword === newPassword) {
            console.log('Password same',);
            return NextResponse.json(
                { success: false, message: 'New password cannot be the same as the old password.' },
                { status: 400 }
            );
        }

        const isMatch = await bcrypt.compare(currentPassword, student.password);
        console.log(isMatch);
        if (!isMatch) {
            return NextResponse.json(
                { success: false, message: 'Current password is incorrect.' },
                { status: 400 }
            );
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update admin password
        await Student.findByIdAndUpdate(decoded.id, { password: hashedPassword });

        return NextResponse.json(
            { success: true, message: 'Password updated successfully.' },
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