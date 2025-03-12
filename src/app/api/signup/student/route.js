import connectDb from "@/lib/db";
import Student from "@/models/UserModels/Student";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (req) => {
    try {
        await connectDb();
        const body = await req.json();
        console.log(body);
        const { name, studentId, year, dob, email, password, phoneNumber, parentPhoneNumber
            , address, mess, block, room, gender } = body;

        if (!name || !studentId || !year || !dob || !email || !password || !phoneNumber || !parentPhoneNumber || !address || !gender) {
            return new NextResponse(JSON.stringify({ success: false, message: "All fields are required" }), { status: 400 });
        }

        if (isNaN(year) || year < 0) {
            return new NextResponse(JSON.stringify({ success: false, message: "Invalid year provided" }), { status: 400 });
        }


        if (await Student.findOne({ studentId })) {
            return new NextResponse(JSON.stringify({ success: false, message: "Student ID already exists" }), { status: 400 });
        }
        if (await Student
            .findOne({ email })) {
            return new NextResponse(JSON.stringify({ success: false, message: "Email already exists" }), { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const student = new Student({
            name, studentId, year, dob, email, password: hashedPassword, phoneNumber, parentPhoneNumber, address, mess, block, room, gender, gym: null
        });

        await student.save();

        return new NextResponse(JSON.stringify({ success: true, message: "Student registered successfully" }), { status: 200 });
    }
    catch (err) {
        console.error(err);
        return new NextResponse(JSON.stringify({ success: false, message: "An unexpected error occurred" }), { status: 500 });

    }
};