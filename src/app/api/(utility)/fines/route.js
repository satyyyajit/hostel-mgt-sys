import Admin from "@/models/UserModels/Admin";
import Student from "@/models/UserModels/Student";
import { NextResponse } from "next/server";
import Fee from "@/models/Functions/Fee";
import connectDb from "@/lib/db";
import jwt from 'jsonwebtoken';

export const POST = async (req) => {
    try {
        const cookieHeader = req.headers.get('cookie');
        if (!cookieHeader) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'No cookie found.' }),
                { status: 401 }
            );
        }

        const token = cookieHeader
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];

        if (!token) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'token_not_found' }),
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.id);

        if (!admin) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Admin not found.' }),
                { status: 404 }
            );
        }

        const body = await req.json();

        if (!body) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Invalid data' }),
                { status: 400 }
            );
        }

        await connectDb();

        const student = await Student.findOne({ studentId: body.studentId }).select('_id studentId');

        if (!student) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Student not found' }),
                { status: 404 }
            );
        }

        const newFee = new Fee({
            studentId: body.studentId,
            type: body.type,
            amount: body.amount,
            status: body.status
        });

        try{
            await newFee.save();
            await Student.findByIdAndUpdate(student._id, { $push: { fees: newFee._id } });
        }
        catch (err) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Fee not created' }),
                { status: 400 }
            );
        }


        return new NextResponse(
            JSON.stringify({ success: true, message: 'Fine added successfully', data: newFee }),
            { status: 201 }
        );

    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ success: false, message: 'Internal Server Error' }),
            { status: 500 }
        );
    }
};

export const GET = async (req) => {
    try {
        const cookieHeader = req.headers.get('cookie');
        if (!cookieHeader) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'No cookie found.' }),
                { status: 401 }
            );
        }

        const token = cookieHeader
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];

        if (!token) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'token_not_found' }),
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.id);

        if (!admin) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Admin not found.' }),
                { status: 404 }
            );
        }

        await connectDb();

        const fines = await Fee.find({ type: 'Fine' });

        return new NextResponse(
            JSON.stringify({ success: true, fines }),
            { status: 200 }
        );

    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ success: false, message: 'Internal Server Error' }),
            { status: 500 }
        );
    }
};