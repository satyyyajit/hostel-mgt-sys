import connectDb from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import Fee from "@/models/Functions/Fee";
import Gym from "@/models/Functions/Gym";
import Student from "@/models/UserModels/Student";
import Booking from "@/models/Functions/Booking";
import Room from "@/models/Functions/Room";
import Block from "@/models/Functions/HostelBlock";



export const GET = async (req) => {
    try {
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
        const studentId = decoded.studentId;

        if (!studentId) {
            return NextResponse.json(
                { error: "Unauthorized: Invalid token" },
                { status: 401 }
            );
        }

        console.log("Student ID:", studentId);

        const studentFees = await Fee.find({ studentId });
        console.log("Student fees:", studentFees);

        if (!studentFees) {
            return NextResponse.json(
                { error: "No fees due found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, studentFees, status: 200 });


    }
    catch (err) {
        console.error("Error in GET /api/fees:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
};

const gym = async (transactionId)=>{
    const transaction = await Fee.findOne({ _id: transactionId });
    const studentId = transaction.studentId;
    const subscription = await Gym.findOneAndUpdate({ studentId }, { $set: { active:true  } });
    console.log("Subscription:", subscription);
    await Fee.findOneAndUpdate({ _id: transactionId }, { $set: { status: 'paid' } });
    console.log("Transaction updated to paid");
}

const roomMess = async (transactionId)=>{
    try {
        const transaction = await Fee.findOne({ _id: transactionId });
        const studentId = transaction.studentId;
        const book = await Booking.findOneAndUpdate({ studentId }, { $set: { status: 'approved'} });
        console.log("Booking:", book);
        await Fee.findOneAndUpdate({ _id: transactionId }, { $set: { status: 'paid' } });
        console.log("Transaction updated to paid");
        const room = await Room.findOne({ studentId });
        await Student.findOneAndUpdate({ studentId }, { $set: { room: room._id } });
        await Student.findOneAndUpdate({ studentId }, { $set: { mess: book.messType } });
        const block = await HostelBlock.findOne({ blockName: room.hostelBlock });
        await Student.findOneAndUpdate({ studentId }, { $set: { block: block._id } });
        console.log("Room allocated:", room);
    } catch (error) {
        console.error("Error updating transaction:", error);
    }
}

const fine = async (transactionId) => {
    try {
        console.log("Updating fine for transaction ID:", transactionId);
        const transaction = await Fee.findOne({ _id: transactionId });
        if (!transaction) {
            console.error("Transaction not found");
            return;
        }
        const updatedFine = await Fee.findOneAndUpdate(
            { _id: transactionId },
            { $set: { status: 'paid' } },
            { new: true } // Return the updated document
        );

        console.log("Updated Fine:", updatedFine); // Log the updated document
        console.log("Fine updated to paid");
    } catch (err) {
        console.error("Error updating fine:", err);
    }
};


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
        const studentId = decoded.studentId;

        if (!studentId) {
            return NextResponse.json(
                { error: "Unauthorized: Invalid token" },
                { status: 401 }
            );
        }

        console.log("Student ID:", studentId);

        const body = await req.json();

        const { transactionId } = body;
        console.log("Transaction ID:", transactionId);

        const transaction = await Fee.findOne({ _id: transactionId });

        console.log("Transaction:", transaction);

        if (!transaction) {
            return NextResponse.json(
                { error: "Transaction not found" },
                { status: 404 }
            );
        }

        if(transaction.type === 'GymFee' && transaction.status === 'pending'){
            await gym(transactionId);
        }

        if(transaction.type === 'Fine' && transaction.status === 'pending'){
            await fine(transactionId);
        }   


        if(transaction.type === 'RoomMessFee' && transaction.status === 'pending'){
            await roomMess(transactionId);
        }

        console.log("Payment confirmed");
        return NextResponse.json({ success: true, message:'Payment Confirmed', status: 200 });
    }
    catch (err) {
        console.error("Error in POST /api/fees:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}