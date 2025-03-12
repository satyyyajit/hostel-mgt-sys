import connectDb from "@/lib/db";
import Feedback from "@/models/UtilityModels/Feedback";
import Student from "@/models/UserModels/Student";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const POST = async (req) => {
    try {
        // Connect to the database
        await connectDb();

        // Extract the token from cookies
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
        console.log('Student ID:', studentId);

        // Extract data from the request body
        const { description, type, star } = await req.json();
        console.log('Description:', description);
        console.log('Type:', type);
        console.log('Star:', star);

        // Validate required fields
        if (!description || !type || !star) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Description, type, and star rating are required.' }),
                { status: 400 }
            );
        }

        // Create feedback
        const createdFeedback = await Feedback.create({
            studentId,
            description,
            type,
            star
        });

        // Update the student's feedbacks array
        await Student.findOneAndUpdate(
            { studentId },
            { $push: { feedback: createdFeedback._id } },
            { new: true }
        );

        // Return success response
        return new NextResponse(
            JSON.stringify({ success: true, message: 'Feedback submitted successfully.', data: createdFeedback }),
            { status: 201 }
        );
    } catch (err) {
        console.error('Error in POST /api/student/feedbacks:', err);
        return new NextResponse(
            JSON.stringify({ success: false, message: 'Internal server error.' }),
            { status: 500 }
        );
    }
};

