import connectDb from "@/lib/db";
import Notice from "@/models/UtilityModels/Notice";
import Student from "@/models/UserModels/Student";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (req, res) => {
    try{
        const sample = {
            title: "Notice",
            description: "Notice",
            admin: "Admin",
        }
        if(!sample) return NextResponse.status(400).json({message: "Invalid data"});
        await connectDb();
        const notice = new Notice(sample);
        if(!notice) return NextResponse.status(400).json({message: "Notice not created"});
        await notice.save();
        return NextResponse.json({message: "Notice created successfully"}, {status: 201});
    }
    catch(err){
        return NextResponse.json({message: err.message},{status: 500});
    }
};

export const GET = async (req, res) => {
    try{
        await connectDb();
        const notices = await Notice.find().select("-__v").sort({date: -1});
        if(!notices) return NextResponse.status(400).json({message: "No notices found"});
        return NextResponse.json({notices}, {status: 200});
    }
    catch(err){
        return res.status(500).json({message: err.message});
    }
}

