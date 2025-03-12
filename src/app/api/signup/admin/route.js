import connectDb from '@/lib/db';
import Admin from '@/models/UserModels/Admin';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    await connectDb();

    try {
        const file = await req.json();
        console.log(file);
        const { name, empId, email, password, dob, contact, address, role, hostelBlock } = file;
        // Basic validation
        
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ $or: [{ email }, { empId }] });
        if (existingAdmin) {
            return new NextResponse(JSON.stringify({ success: false, message: 'Admin with this email or employee ID already exists.' }), { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new admin
        const newAdmin = new Admin({
            name,
            empId,
            email,
            password: hashedPassword,
            dob,
            contact,
            address,
            role,
            hostelBlock
        });

        await newAdmin.save();

        return new NextResponse(JSON.stringify({ success: true, message: 'Admin registered successfully.' }), { status: 201 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ success: false, message: error.message }), { status: 500 });
    }
}