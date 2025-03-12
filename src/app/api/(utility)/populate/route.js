import connectDb from "@/lib/db";
import { NextResponse } from "next/server";
import Room from "@/models/Functions/Room";
import HostelBlock from "@/models/Functions/HostelBlock";

export const POST = async (req)=>{
    try{
        await connectDb();
        
        const { roomNumber, roomType, floor, hostelBlock } = await req.json();

        const block = await HostelBlock
            .findOne({ blockName: hostelBlock })
            .select('-_id')
            .lean();

        if(!block){
            return NextResponse.json({ error: 'Block not found', status: 404 });
        }

        console.log(block);

        const room = await Room.create({ roomNumber, roomType, floor, hostelBlock: block.blockName });
        return NextResponse.json({ room, status: 201 });

    }
    catch(err){
        return NextResponse.json({ error: err.message, status: 400 });
    }
}