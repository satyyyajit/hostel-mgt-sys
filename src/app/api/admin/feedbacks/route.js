import Feedback from "@/models/UtilityModels/Feedback";
import connectDb from "@/lib/db";
import { NextResponse } from "next/server";


export const GET = async () => {
    try{
        await connectDb();
        const feedbacks = await Feedback.find({});
        if(!feedbacks){
            return NextResponse.json({ message: 'No feedbacks found' }, { status: 404 });
        }
        return NextResponse.json(feedbacks, { status: 200 });
    }
    catch(err){
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
};