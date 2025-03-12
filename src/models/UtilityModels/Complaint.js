import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ComplaintSchema = new Schema({
    studentId: {
        type: String,
        required: true,
        ref: 'Student'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['room', 'mess', 'gym', 'hostel'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending','resolved'], 
        default: 'pending'
    },
}, { timestamps: true });

const Complaint = mongoose.models.Complaint || mongoose.model('Complaint', ComplaintSchema);

export default Complaint;