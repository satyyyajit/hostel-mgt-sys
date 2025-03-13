// pages/api/student/transactions/[id].js
import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import connectDb from "@/lib/db";
import Fee from "@/models/Functions/Fee"; // Adjust the model import as needed

export const GET = async (req, { params }) => {
    try {
        const { id } = await params;

        // Connect to the database
        await connectDb();

        // Find the transaction by ID
        const transaction = await Fee.findById(id);
        if (!transaction) {
            return new NextResponse(
                JSON.stringify({ success: false, message: 'Transaction not found.' }),
                { status: 404 }
            );
        }

        // Create a PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Add content to the PDF
        page.drawText(`Transaction Receipt`, {
            x: 50,
            y: height - 50,
            size: 24,
            font,
            color: rgb(0, 0, 0),
        });

        page.drawText(`Transaction ID: ${transaction._id}`, {
            x: 50,
            y: height - 100,
            size: 14,
            font,
            color: rgb(0, 0, 0),
        });

        page.drawText(`Student ID: ${transaction.studentId}`, {
            x: 50,
            y: height - 130,
            size: 14,
            font,
            color: rgb(0, 0, 0),
        });

        page.drawText(`Type: ${transaction.type}`, {
            x: 50,
            y: height - 160,
            size: 14,
            font,
            color: rgb(0, 0, 0),
        });

        page.drawText(`Amount: ${transaction.amount}`, {
            x: 50,
            y: height - 190,
            size: 14,
            font,
            color: rgb(0, 0, 0),
        });

        page.drawText(`Date: ${new Date(transaction.createdAt).toLocaleDateString()}`, {
            x: 50,
            y: height - 220,
            size: 14,
            font,
            color: rgb(0, 0, 0),
        });

        page.drawText(`Status: ${transaction.status}`, {
            x: 50,
            y: height - 250,
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
                'Content-Disposition': `attachment; filename="transaction_${transaction._id}.pdf"`,
            },
        });
    } catch (err) {
        return new NextResponse(
            JSON.stringify({ success: false, message: 'An error occurred while generating the PDF.' }),
            { status: 500 }
        );
    }
};