import Student from "@/models/UserModels/Student";
import { NextResponse } from "next/server";
import Leave from "@/models/UtilityModels/Leave";
import jwt from 'jsonwebtoken';
import connectDb from "@/lib/db";

export const POST = async (req) => {
    try {
        const body = await req.json();

        // Validate required fields
        const requiredFields = ['startDate', 'startTime', 'endDate', 'endTime', 'reason', 'place', 'phoneNumber'];
        for (const field of requiredFields) {
            if (!body[field]) {
                return new NextResponse(
                    JSON.stringify({ success: false, message: `${field} is required.` }),
                    { status: 400 }
                );
            }
        }

        // Validate token
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

        // Connect to database
        await connectDb();

        // Find student
        const student = await Student.findOne({ studentId });
        if (!student) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Student not found.' }),
                { status: 404 }
            );
        }

        // Create leave
        const createLeave = new Leave({
            studentId,
            startDate: body.startDate,
            startTime: body.startTime,
            endDate: body.endDate,
            endTime: body.endTime,
            reason: body.reason,
            place: body.place,
            phoneNumber: body.phoneNumber,
            status: 'pending'
        });

        await createLeave.save();

        // Update student with new leave
        await Student.findOneAndUpdate(
            { studentId },
            { $push: { leaves: createLeave._id } }
        );

        return new NextResponse(
            JSON.stringify({ data: createLeave, success: true, message: 'Leave created successfully.' }),
            { status: 200 }
        );
    } catch (err) {
        return new NextResponse(
            JSON.stringify({ success: false, message: 'An error occurred while creating leave.' }),
            { status: 500 }
        );
    }
};

export const GET = async (req) => {
    try {
        // Validate token
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

        // Connect to database
        await connectDb();

        // Find student
        const student = await Student.findOne({ studentId });
        if (!student) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Student not found.' }),
                { status: 404 }
            );
        }

        const leaves = await Leave.find({ studentId }).sort({ createdAt: -1 });
        if (!leaves) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'An error occurred while fetching leaves.' }),
                { status: 500 }
            );
        }

        return new NextResponse(
            JSON.stringify({ success: true, studentId, message: 'Leaves fetched successfully.', leaves }),
            { status: 200 }
        );
    } catch (err) {
        return new NextResponse(
            JSON.stringify({ success: false, message: 'An error occurred while fetching leaves.' }),
            { status: 500 }
        );
    }
};