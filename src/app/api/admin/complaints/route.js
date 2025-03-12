import Complaint from "@/models/UtilityModels/Complaint";
import connectDb from "@/lib/db";
import Admin from "@/models/UserModels/Admin";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// Helper function for consistent error responses
const errorResponse = (message, status = 500, error = null) => {
    return NextResponse.json({
        success: false,
        message,
        error: process.env.NODE_ENV === 'development' ? error?.message || null : null
    }, { status });
};

export const GET = async (req) => {
    try {
        // Connect to DB early to catch connection issues
        await connectDb();

        // Cookie validation
        const cookieHeader = req.headers.get('cookie');
        if (!cookieHeader) {
            return errorResponse('No cookie found. Authentication required.', 401);
        }

        const token = cookieHeader
            .split('; ')
            .find(row => row.startsWith('token='))?.split('=')[1];

        if (!token) {
            return errorResponse('Token not found in cookie. Authentication required.', 401);
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return errorResponse('Invalid or expired token. Please log in again.', 401, error);
        }

        if (!decoded.id) {
            return errorResponse('Invalid token payload. Authentication required.', 401);
        }

        // Admin validation
        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            return errorResponse('Admin not found or unauthorized. Access denied.', 403);
        }

        // Fetch complaints
        const complaints = await Complaint.find({}).lean();
        if (!complaints || complaints.length === 0) {
            return NextResponse.json({
                success: true,
                data: [],
                message: 'No complaints found.'
            }, { status: 200 });
        }

        return NextResponse.json({
            success: true,
            complaints,
            message: 'Complaints retrieved successfully.'
        }, { status: 200 });

    } catch (error) {
        console.error('Error in GET /api/admin/complaints:', error);
        return errorResponse('Failed to retrieve complaints due to a server error.', 500, error);
    }
};

export const PUT = async (req) => {
    try {
        await connectDb();

        const { id } = await req.json(); // Parse JSON body

        if (!id) {
            return errorResponse('Complaint ID is required to update the status.', 400);
        }

        const complaint = await Complaint.findById(id);
        if (!complaint) {
            return errorResponse('Complaint not found. Please check the ID and try again.', 404);
        }

        if (complaint.status === 'resolved') {
            return errorResponse('Complaint is already resolved. No further action required.', 400);
        }

        complaint.status = 'resolved';
        await complaint.save();

        return NextResponse.json({
            success: true,
            message: 'Complaint resolved successfully.'
        }, { status: 200 });

    } catch (error) {
        console.error('Error in PUT /api/admin/complaints:', error);
        return errorResponse('Failed to update complaint due to a server error.', 500, error);
    }
};

export const DELETE = async (req) => {
    try {
        await connectDb();

        const { id } = await req.json(); // Parse JSON body

        if (!id) {
            return errorResponse('Complaint ID is required to delete the record.', 400);
        }

        const complaint = await Complaint.findById(id);
        if (!complaint) {
            return errorResponse('Complaint not found. Please check the ID and try again.', 404);
        }

        await complaint.deleteOne(); // Use deleteOne instead of remove (deprecated)

        return NextResponse.json({
            success: true,
            message: 'Complaint deleted successfully.'
        }, { status: 200 });

    } catch (error) {
        console.error('Error in DELETE /api/admin/complaints:', error);
        return errorResponse('Failed to delete complaint due to a server error.', 500, error);
    }
};