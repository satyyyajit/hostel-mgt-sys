import Leave from "@/models/UtilityModels/Leave";
import Student from "@/models/UserModels/Student";
import Admin from "@/models/UserModels/Admin";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import { NextResponse } from 'next/server';

export const POST = async (req) => {
    try {
        // Cookie validation
        const cookieHeader = req.headers.get('cookie');
        if (!cookieHeader) {
            return NextResponse.json(
                { success: false, message: 'Authentication required: No cookie found.' },
                { status: 401 }
            );
        }

        const token = cookieHeader
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];
        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Authentication required: Token not found in cookie.' },
                { status: 401 }
            );
        }

        // JWT verification
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return NextResponse.json(
                { success: false, message: 'Invalid or expired token.', error: err.message },
                { status: 401 }
            );
        }

        // Database connection
        try {
            await dbConnect();
        } catch (err) {
            return NextResponse.json(
                { success: false, message: 'Database connection failed.', error: err.message },
                { status: 500 }
            );
        }

        // Admin validation
        const admin = await Admin.findOne({ _id: decoded.id });
        if (!admin) {
            return NextResponse.json(
                { success: false, message: 'Admin not found or unauthorized.' },
                { status: 403 }
            );
        }

        // Request body validation
        let body;
        try {
            body = await req.json();
        } catch (err) {
            return NextResponse.json(
                { success: false, message: 'Invalid request body.', error: err.message },
                { status: 400 }
            );
        }

        if (!body.studentId) {
            return NextResponse.json(
                { success: false, message: 'Student ID is required.' },
                { status: 400 }
            );
        }

        // Student validation
        const student = await Student.findOne({ studentId: body.studentId });
        if (!student) {
            return NextResponse.json(
                { success: false, message: 'Student not found.' },
                { status: 404 }
            );
        }

        // Create and save leave
        const leave = new Leave({
            studentId: student.studentId,
            startDate: body.startDate,
            startTime: body.startTime,
            endDate: body.endDate,
            endTime: body.endTime,
            reason: body.reason,
            place: body.place,
            phoneNumber: body.phoneNumber
        });

        try {
            await leave.save();
            await Student.findOneAndUpdate(
                { studentId: body.studentId },
                { $push: { leaves: leave._id } }
            );
        } catch (err) {
            return NextResponse.json(
                { success: false, message: 'Failed to save leave application.', error: err.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Leave application submitted successfully.', leave },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
};


export const GET = async (req) => {
    try {
        // Cookie validation
        const cookieHeader = req.headers.get('cookie');
        if (!cookieHeader) {
            return NextResponse.json(
                { success: false, message: 'Authentication required: No cookie found.' },
                { status: 401 }
            );
        }

        const token = cookieHeader
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];
        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Authentication required: Token not found in cookie.' },
                { status: 401 }
            );
        }

        // JWT verification
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return NextResponse.json(
                { success: false, message: 'Invalid or expired token.', error: err.message },
                { status: 401 }
            );
        }

        // Database connection
        try {
            await dbConnect();
        } catch (err) {
            return NextResponse.json(
                { success: false, message: 'Database connection failed.', error: err.message },
                { status: 500 }
            );
        }

        // Admin validation
        const admin = await Admin.findOne({ _id: decoded.id });
        if (!admin) {
            return NextResponse.json(
                { success: false, message: 'Admin not found or unauthorized.' },
                { status: 403 }
            );
        }

        // Get all leave applications
        const leaves = await Leave.find({});

        return NextResponse.json(
            { success: true, message: 'Leave applications fetched successfully.', leaves },
            { status: 200 }
        );
    }
    catch (error) {
        return NextResponse.json(
            { success: false, message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
};

export const PUT = async (req, { params }) => {
    try {
        // Cookie validation
        const cookieHeader = req.headers.get('cookie');
        if (!cookieHeader) {
            return NextResponse.json(
                { success: false, message: 'Authentication required: No cookie found.' },
                { status: 401 }
            );
        }

        const token = cookieHeader
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];
        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Authentication required: Token not found in cookie.' },
                { status: 401 }
            );
        }

        // JWT verification
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return NextResponse.json(
                { success: false, message: 'Invalid or expired token.', error: err.message },
                { status: 401 }
            );
        }

        // Database connection
        try {
            await dbConnect();
            console.log('connected');
        } catch (err) {
            return NextResponse.json(
                { success: false, message: 'Database connection failed.', error: err.message },
                { status: 500 }
            );
        }

        // Admin validation
        const admin = await Admin.findOne({ _id: decoded.id });
        if (!admin) {
            return NextResponse.json(
                { success: false, message: 'Admin not found or unauthorized.' },
                { status: 403 }
            );
        }

        // Leave validation
        let body;
        try {
            body = await req.json();
            // console.log(body);
        } catch (err) {
            return NextResponse.json({ success: false, message: 'Invalid request body.', error: err.message }, { status: 400 });
        }

        if (!body.status || !['pending', 'approved', 'rejected'].includes(body.status) || !body.id) {
            return NextResponse.json({ success: false, message: 'Status is required.' }, { status: 400 });
        }

        const leave = await Leave.findById(body.id);
        if (!leave) {
            return NextResponse.json({ success: false, message: 'Leave not found.' }, { status: 404 });
        }
        console.log(body.id, body.status, leave);

        try {
            // console.log(body.id, body.status, leave);
            await Leave.findByIdAndUpdate
                (body.id, { status: body.status });
        } catch (err) {
            return NextResponse.json({ success: false, message: 'Failed to update leave status.', error: err.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Leave status updated successfully.' }, { status: 200 });


    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }

}