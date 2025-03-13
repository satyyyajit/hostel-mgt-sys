// pages/api/student/leave/[id].js
import { NextResponse } from "next/server";
import Leave from "@/models/UtilityModels/Leave";
import connectDb from "@/lib/db";
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export const GET = async (req, { params }) => {
    try {
        const { id } = await params;

        // Connect to the database
        await connectDb();

        // Find the leave request by ID
        const leave = await Leave.findById(id);
        if (!leave) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Leave request not found.' }),
                { status: 404 }
            );
        }

        // Create a PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Add content to the PDF
        page.drawText(`Leave Request Details`, {
            x: 50,
            y: height - 50,
            size: 24,
            font,
            color: rgb(0, 0, 0),
        });

        page.drawText(`Leave Id: ${leave._id}`, 
            {
                x: 50,
                y: height - 70,
                size: 14,
                font,
                color: rgb(0, 0, 0),
            }
        );

        page.drawText(`Student ID: ${leave.studentId}`, {
            x: 50,
            y: height - 100,
            size: 14,
            font,
            color: rgb(0, 0, 0),
        });

        page.drawText(`Place: ${leave.place}`, {
            x: 50,
            y: height - 130,
            size: 14,
            font,
            color: rgb(0, 0, 0),
        });

        page.drawText(`Reason: ${leave.reason}`, {
            x: 50,
            y: height - 160,
            size: 14,
            font,
            color: rgb(0, 0, 0),
        });

        page.drawText(`Duration: ${new Date(leave.startDate).toLocaleDateString()} ${leave.startTime} to ${new Date(leave.endDate).toLocaleDateString()} ${leave.endTime}`, {
            x: 50,
            y: height - 190,
            size: 14,
            font,
            color: rgb(0, 0, 0),
        });

        page.drawText(`Status: ${leave.status}`, {
            x: 50,
            y: height - 220,
            size: 14,
            font,
            color: rgb(0, 0, 0),
        });

        // Serialize the PDF to bytes
        const pdfBytes = await pdfDoc.save();

        // Return the PDF as a downloadable file
        return new NextResponse(pdfBytes, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="leave_request_${leave._id}.pdf"`,
            },
        });
    } catch (err) {
        return new NextResponse(
            JSON.stringify({ success: false, message: 'An error occurred while generating the PDF.' }),
            { status: 500 }
        );
    }
};