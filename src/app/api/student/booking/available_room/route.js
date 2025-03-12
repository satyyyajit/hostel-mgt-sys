import Room from "@/models/Functions/Room";
import Student from "@/models/UserModels/Student";
import jwt from "jsonwebtoken";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// this is the route for getting all available rooms for a student to book
// this route is protected and only accessible to authenticated students
// route: /api/student/booking/available_room
export const GET = async (req) => {

    try {
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
        const student = await Student.findOne({ studentId: studentId });
        if (!student) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Student not found.' }),
                { status: 404 }
            );
        }

        // Find all rooms
        const hostel = (student.gender === 'Female') ? 'B1' : 'A1';
        const genderRooms = await Room.find({ isVacant: true, hostelBlock: hostel });
        const availableRooms = genderRooms.filter(room => room.students.length < room.roomType);

        console.log("Available rooms:", availableRooms);
        return new NextResponse(
            JSON.stringify({ success: true, availableRooms, student }),
            { status: 200 }
        );


    } catch (error) {
        console.error("Error in GET /api/student/booking/available_room:", error);
        return new NextResponse(
            JSON.stringify({ success: false, message: 'Internal server error.' }),
            { status: 500 }
        );
    }
};