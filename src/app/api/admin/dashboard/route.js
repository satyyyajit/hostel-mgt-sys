import connectDb from "@/lib/db";
import Admin from "@/models/UserModels/Admin";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Student from "@/models/UserModels/Student";
import Complaint from "@/models/UtilityModels/Complaint";

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

        console.log('Token:', token); 
        
        
        if (!token) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'token_not_found' }),
                { status: 401 }
            );
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log('Decoded:', decoded);

        
        // Find the user in the database
        const admin = await Admin.findById(decoded.id);

        if (!admin) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Admin not found.' }),
                { status: 404 }
            );
        }

        console.log('Admin:', admin);

        const getStudent = await Student.find();
        // console.log(getStudent.length);

        const getComplaints = await Complaint.find();
        // console.log(getComplaints.length);

        return new NextResponse(
            JSON.stringify({ admin, numberOfStudents:getStudent.length, complaints:getComplaints.length ,success: true, message: 'Admin found.' }),
            { status: 200 }
        );

    } catch (err) {
        console.error('Error in GET /api/admin:', err);

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