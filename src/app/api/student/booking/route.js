import Student from "@/models/UserModels/Student";
import Room from "@/models/Functions/Room";
import Booking from "@/models/Functions/Booking";
import HostelBlock from "@/models/Functions/HostelBlock";
import Fee from "@/models/Functions/Fee";
import jwt from "jsonwebtoken";
import connectDb from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";



export const POST = async (req) => {
    try {
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

        const body = await req.json();
        const { preferredRoom, bedType, messType } = body;

        // Check if student has already booked a room
        if (student.booking) {
            console.log("Student has already booked a room");
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Student has already booked a room.' }),
                { status: 400 }
            );
        }

        // Check if room exists
        const room = await Room.findOne({ roomNumber: preferredRoom });
        if (!room) {
            console.log("Room not found");
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Room not found.' }),
                { status: 404 }
            );
        }

        console.log(room.students.length);

        // Check if room is already occupied
        if (room.students.length >= room.roomType) {
            console.log("Room is already occupied");
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Room is already occupied.' }),
                { status: 400 }
            );
        }
        if (!messType) {
            console.log("Invalid mess type provided");
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Invalid mess type provided.' }),
                { status: 400 }
            );
        }
        if (messType.toLowerCase() !== 'v' && messType.toLowerCase() !== 'nv') {
            console.log("Invalid mess type provided");
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Invalid mess type provided.' }),
                { status: 400 }
            );
        }

        // Create a fee for the room
        const fee = new Fee({

            studentId: student.studentId,
            type: 'RoomMessFee',
            amount: room.roomType * 2000 + (messType === 'v' ? 2000 : 3000),
            status: 'pending'
        });
        console.log(fee);

        await fee.save();

        // Create the booking
        const booking = await Booking.create({
            room: preferredRoom,
            roomId: room._id,
            roomType: bedType,
            messType: messType.toLowerCase() === 'v' ? 'Veg' : messType.toLowerCase() === 'nv' ? 'NonVeg' : null,
            email: student.email,
            studentId: student.studentId,
            transactionId: fee._id // Set the transactionId to the fee's _id
        });
        console.log(booking);

        // Update the room with the new student
        await Room.findByIdAndUpdate(
            room._id,
            {
                $push: { students: student._id },
                $set: { isVacant: room.students.length + 1 < room.roomType }
            }
        );

        // Update the student with the new booking and fee
        await Student.findByIdAndUpdate(student._id, { booking: booking._id });
        await Student.findByIdAndUpdate(student._id, { $push: { fees: fee._id } });

        await Student.findOneAndUpdate({ studentId }, { $set: { room: room._id } }, { new: true });
        await Student.findOneAndUpdate({ studentId }, { $set: { mess: booking.messType }},{ new : true});
        const block = await HostelBlock.findOne({ blockName: room.hostelBlock });
        await Student.findOneAndUpdate({ studentId }, { $set: { block: block._id } },{ new : true});

        return new NextResponse(
            JSON.stringify({ success: true, message: 'Booking successful, Complete the transaction to confirm.' }),
            { status: 200 }
        );

    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ success: false, message: 'Internal server error.' }),
            { status: 500 }
        );
    }
}

export const GET = async (req) => {
    try {
        //token validation
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
        const student = await Student.findOne({ studentId: studentId });
        if (!student) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Student not found.' }),
                { status: 404 }
            );
        }

        if (!student.booking) {
            return new NextResponse(
                JSON.stringify({ success: true, message: 'No booking found.', booking: null }),
                { status: 200 }
            );
            
        }

        // Find booking
        const booking = await Booking.findOne({ _id: student.booking });
        if (!booking) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Booking not found.' }),
                { status: 404 }
            );
        }

        // show that if payment is done or not
        const fee = await Fee.findOne({ _id: booking.transactionId });
        if (!fee) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Fee not found.' }),
                { status: 404 }
            );
        }


        const b = {
            room: booking.room,
            roomType: booking.roomType,
            messType: booking.messType,
            bookingDate: booking.bookingDate,
            status: booking.status,
            transactionId: booking.transactionId,
            fee: fee.amount,
            paymentStatus: fee.status
        };

        console.log(b);

        return new NextResponse(
            JSON.stringify({
                success: true,
                booking: {
                    room: booking.room,
                    roomType: booking.roomType,
                    messType: booking.messType,
                    bookingDate: booking.bookingDate,
                    status: booking.status,
                    transactionId: booking.transactionId,
                    fee: fee.amount,
                    paymentStatus: fee.status
                }
            }),
            { status: 200 }
        );


    }
    catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ success: false, message: 'Internal server error.' }),
            { status: 500 }
        );
    }
}