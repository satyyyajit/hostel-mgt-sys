import Fee from "@/models/Functions/Fee";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import { NextResponse } from 'next/server';
import Admin from "@/models/UserModels/Admin";

export const GET = async (req) => {
    try {
        await dbConnect();

        const cookieHeader = req.headers.get('cookie');
        if (!cookieHeader) {
            return NextResponse.json({ success: false, message: 'No cookie found.' }, { status: 401 });
        }

        const token = cookieHeader
            .split('; ')
            .find(row => row.startsWith('token='))?.split('=')[1];

        if (!token) {
            return NextResponse.json({ success: false, message: 'Token not found in cookie.' }, { status: 401 });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return NextResponse.json({ success: false, message: 'Invalid token.', error: error.message }, { status: 401 });
        }

        if (!decoded.id) {
            return NextResponse.json({ success: false, message: 'Invalid token payload.' }, { status: 401 });
        }

        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            return NextResponse.json({ success: false, message: 'Admin not found or unauthorized.' }, { status: 403 });
        }

        const fees = await Fee.find({});
        return NextResponse.json({ success: true, fees }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal server error', error: error.message }, { status: 500 });
    }
};
