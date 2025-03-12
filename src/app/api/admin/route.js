import { NextResponse, NextRequest } from "next/server";
import Admin from "@/models/UserModels/Admin";
import connectDb from "@/lib/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const GET = async (req)=>{
    try{
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

                console.log('Admin:', admin);

                return new NextResponse(
                    JSON.stringify({ admin, success: true, message: 'Admin found.' }),
                    { status: 200 }
                );
    }
    catch(err){
        console.log(err);
        return new NextResponse(
            JSON.stringify({ success: false, message: 'Internal Server Error.' }),
            { status: 500 }
        );

    }   
}

export const PUT = async (req) => {
    try{
        await connectDb();
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return NextResponse.json(
                { success: false, message: 'Invalid or expired token.' },
                { status: 401 }
            );
        }

        await connectDb();

        const admin = await Admin.findOne({ _id: decoded.id });
        if (!admin) {
            return NextResponse.json(
                { success: false, message: 'Admin not found.' },
                { status: 404 }
            );
        }

        const { password, newPassword, confirmPassword } = await req.json();

        // Validate input fields
        if (!password || !newPassword || !confirmPassword) {
            console.log('All fields are required',);
            return NextResponse.json(
                { success: false, message: 'All fields are required.' },
                { status: 400 }
            );
        }

        if (newPassword !== confirmPassword) {
            console.log('Password not same',);
            return NextResponse.json(
                { success: false, message: 'New password and confirm password do not match.' },
                { status: 400 }
            );
        }

        if (password === newPassword) {
            console.log('Password same',);
            return NextResponse.json(
                { success: false, message: 'New password cannot be the same as the old password.' },
                { status: 400 }
            );
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        console.log(isMatch);
        if (!isMatch) {
            return NextResponse.json(
                { success: false, message: 'Current password is incorrect.' },
                { status: 400 }
            );
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update admin password
        await Admin.findByIdAndUpdate(decoded.id, { password: hashedPassword });

        return NextResponse.json(
            { success: true, message: 'Password updated successfully.' },
            { status: 200 }
        );


    }
    catch(err){
        console.log(err);
        return new NextResponse(
            JSON.stringify({ success: false, message: 'Internal Server Error.' }),
            { status: 500 }
        );
    }
};