import Gym from "@/models/Functions/Gym";
import Admin from "@/models/UserModels/Admin";
import Student from "@/models/UserModels/Student";
import connectDb from "@/lib/db";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req, res) => {
    try {
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
                JSON.stringify({ success: false, message: 'Token not found in cookie.' }),
                { status: 401 }
            );
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        await connectDb();
        console.log('database connected');

        const admin = await Admin.findOne({ _id: decoded.id });
        
        if (!admin) {
            console.log('Admin not found.');
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Admin not found.' }),
                { status: 404 }
            );
        }

        const students = await Gym.find({});
        if (!students) {
            console.log('No students found.');
            return new NextResponse(
                JSON.stringify({ success: false, message: 'No students found.' }),
                { status: 404 }
            );
        }
        console.log('Students:', students);

        return new NextResponse(
            JSON.stringify({ students, success: true, message: 'Students found.' }),
            { status: 200 }
        );


    }
    catch (err) {
        console.error(err);
    }
};

export const DELETE = async (req, res) => { 
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
                JSON.stringify({ success: false, message: 'Token not found in cookie.' }),
                { status: 401 }
            );
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        await connectDb();

        const admin = await Admin.findOne({ _id: decoded.id });
        if (!admin) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Admin not found.' }),
                { status: 404 }
            );
        }


};