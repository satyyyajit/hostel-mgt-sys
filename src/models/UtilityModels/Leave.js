import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema({
    studentId: {
        type: String,
        ref: 'Student',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

const Leave = mongoose.models.Leave || mongoose.model('Leave', leaveSchema);

export default Leave;