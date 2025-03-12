import Admin from "@/models/UserModels/Admin";
import Notice from "@/models/UtilityModels/Notice";
import { NextResponse } from "next/server";
import connectDb from "@/lib/db";
import jwt from "jsonwebtoken";

export const POST = async (req) => {
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
        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            return NextResponse.json({ success: false, message: "Admin not found." }, { status: 404 });
        }

        const body = await req.json();
        if (!body.title || !body.description) {
            return NextResponse.json({ success: false, message: "Title and Description are required." }, { status: 400 });
        }

        body.admin = `${admin.empId} ${admin.name}`;
        const notice = new Notice(body);
        await notice.save();

        return NextResponse.json({ success: true, message: "Notice created successfully" , notice}, { status: 201 });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
};

export const GET = async (req) => {
    try {
        await connectDb();

        const notices = await Notice.find().sort({ date: -1 });
        return NextResponse.json({ success: true, notices }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
};

export const DELETE = async (req) => {
    try {
        await connectDb();
        const { id } = await req.json();
        const deletedNotice = await Notice.findByIdAndDelete(id);
        if (!deletedNotice) {
            return NextResponse.json({ success: false, message: "Notice not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: "Notice deleted successfully" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
};

export const PUT = async (req) => {
    try {
        await connectDb();
        const { id, title, description } = await req.json();
        const updatedNotice = await Notice.findByIdAndUpdate(id, { title, description }, { new: true });
        if (!updatedNotice) {
            return NextResponse.json({ success: false, message: "Notice not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: "Notice updated successfully" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
};
