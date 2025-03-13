import connectDb from "@/lib/db";
import Student from "@/models/UserModels/Student";
import Room from "@/models/Functions/Room";
import Booking from "@/models/Functions/Booking";
import Block from "@/models/Functions/HostelBlock";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Notice from "@/models/UtilityModels/Notice";
export async function GET(req) {
    try {
        await connectDb();

        // Check if the cookie exists
        const cookieHeader = req.headers.get('cookie');
        if (!cookieHeader) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'No cookie found.' }),
                { status: 401 }
            );
        }

        // Extract the token from the cookie
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch the student details
        const student = await Student.findOne({ _id: decoded.id }).select('-password'); // Exclude password
        if (!student) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Student not found.' }),
                { status: 404 }
            );
        }


        let blockName = '';
        let roomNumber = '';
        let mess = '';
        

        if(student.room || student.block || student.mess){
            const block = await Block.findOne({ _id: student.block });
            blockName = block.blockName;
            const room = await Room.findOne({ _id: student.room });
            roomNumber = room.roomNumber;
            mess = student.mess;
        }

        const notices = await Notice.find({}).sort({ createdAt: -1 });
        

        // Return the student details
        return new NextResponse(
            JSON.stringify({ success: true, student, blockName, roomNumber, mess, notices: notices || [] }),
            { status: 200 }
        );

    } catch (err) {
        console.error('Error in GET /api/student:', err);

        // Handle JWT verification errors
        if (err.name === 'JsonWebTokenError') {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Invalid token.' }),
                { status: 401 }
            );
        }

        // Handle other errors
        return new NextResponse(
            JSON.stringify({ success: false, message: 'Internal server error.' }),
            { status: 500 }
        );
    }
}