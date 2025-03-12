import Attendance from "@/models/UtilityModels/Attendance";
import Student from "@/models/UserModels/Student";
import Room from "@/models/Functions/Room";
import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import jwt from "jsonwebtoken";
import Admin from "@/models/UserModels/Admin";

export const POST = async (req, res) => {
    try {
        await connectDb();

        const cookieHeader = req.headers.get("cookie");
        if (!cookieHeader) {
            return NextResponse.json({ success: false, message: "No cookie found." }, { status: 401 });
        }

        const token = cookieHeader.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
        if (!token) {
            return NextResponse.json({ success: false, message: "Token not found." }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return NextResponse.json({ success: false, message: "Invalid token." }, { status: 401 });
        }

        const admin = await Admin.findById(decoded.id);     
        if (!admin) {
            return NextResponse.json({ success: false, message: "Admin not found." }, { status: 404 });
        }

        const { studentId, room, block, date, status } = await req.json();

        const student = await Student.findById(studentId).select("studentId name phoneNumber");
        if (!student) {
            return NextResponse.json({ success: false, message: "Student not found." }, { status: 404 });
        }
        console.log(student);

        const roomExists = await Room
            .findOne({ room })
            .select("room block")
            .lean();
        if (!roomExists) {
            return NextResponse.json({ success: false, message: "Room not found." }, { status: 404 });
        }

        const attendance = new Attendance({
            student: student._id,
            room: roomExists.room,
            block: roomExists.block,
            date,
            status,
            takenBy: admin.empId + " " + admin.name
        });
        if(!attendance) {
            return NextResponse.json({ success: false, message: "Attendance not marked." }, { status: 400 });
        }

        await attendance.save();
        return NextResponse.json({ success: true, message: "Attendance marked successfully." }, { status: 201 });

    }
    catch (error) {
        return NextResponse.error(error);
    }
};

export const GET = async (req, res) => {
    try {
        await connectDb();

        const cookieHeader = req.headers.get("cookie");
        if (!cookieHeader) {
            return NextResponse.json({ success: false, message: "No cookie found." }, { status: 401 });
        }

        const token = cookieHeader.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
        if (!token) {
            return NextResponse.json({ success: false, message: "Token not found." }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return NextResponse.json({ success: false, message: "Invalid token." }, { status: 401 });
        }

        const admin = await Admin.findById(decoded.id);     
        if (!admin) {
            return NextResponse.json({ success: false, message: "Admin not found." }, { status: 404 });
        }

        const students = await Student.find({})
            .select("studentId name phoneNumber")
            .lean();
        if (!students) {
            return NextResponse.json({ success: false, message: "Students not found." }, { status: 404 });
        }   
        console.log(students);
        return NextResponse.json({ success: true, students }, { status: 200 });
    }
    catch (error) {
        return NextResponse.error(error);
    }
};