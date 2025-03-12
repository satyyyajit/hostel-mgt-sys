import jwt from 'jsonwebtoken';
import connectDb from '@/lib/db';
import Complaint from "@/models/UtilityModels/Complaint";
import Student from "@/models/UserModels/Student";
import { NextResponse } from 'next/server';

export const POST = async (req, res) => {
    try{

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not set in environment variables.');
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Server configuration error.' }),
                { status: 500 }
            );
        }

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
                JSON.stringify({ success: false, message: 'Token not found in cookie.' }),
                { status: 401 }
            );
        }

        // Verify the token
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
        
        const { title, description, type } = await req.json();
        console.log('Title:', title);
        console.log('Description:', description);
        console.log('Type:', type);

        if (!title || !description || !type) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Title, description, and type are required.' }),
                { status: 400 }
            );
        }

        await connectDb();

        const createComplaint = new Complaint({
            studentId,
            title,
            description,
            type,
            status: 'pending'
        });

        await createComplaint.save();

        await Student.findOneAndUpdate({ studentId: studentId }, { $push: { complaints: createComplaint._id } });
        
        return new NextResponse(
            JSON.stringify({ success: true, message: 'Complaint submitted successfully.', complaint: createComplaint }),
            { status: 200 }
        );
    }
    catch(err){
        return new NextResponse(
            JSON.stringify({ success: false, message: 'Internal Server Error' }),
            { status: 500 }
        );

    }


}

export const GET = async (req, res) => {
    try{
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not set in environment variables.');
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Server configuration error.' }),
                { status: 500 }
            );
        }

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
                JSON.stringify({ success: false, message: 'Token not found in cookie.' }),
                { status: 401 }
            );
        }

        // Verify the token
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

        await connectDb();

        const complaints = await Complaint.find({ studentId }).select('-studentId -__v -createdAt -updatedAt');

        console.log(complaints);

        return new NextResponse(
            JSON.stringify({ success: true, data: complaints }),
            { status: 200 }
        );
    }
    catch(err){
        return new NextResponse(
            JSON.stringify({ success: false, message: 'Internal Server Error' }),
            { status: 500 }
        );

    }

}