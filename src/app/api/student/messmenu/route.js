import Menu from "@/models/Functions/Menu";
import jwt from "jsonwebtoken";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req) => {

    try{
        await connectDb();
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
            console.log("Student not found");
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Student not found.' }),
                { status: 404 }
            );
        }

        // Find student's mess menu
        const menu = await Menu.find({})

        return new NextResponse(
            JSON.stringify({ success: true, menu }),
            { status: 200 }
        );
    }
    catch(error){
        console.error('Error:', error);
        return new NextResponse(
            JSON.stringify({ success: false, message: 'An error occurred.' }),
            { status: 500 }
        );
    }

}