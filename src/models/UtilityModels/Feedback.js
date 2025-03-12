import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    studentId: {
        type: String,
        ref: 'Student',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['mess', 'gym', 'hostel', 'room'],
        required: true
    },
    star:{
        type: Number,
        required: true
    }
}, { timestamps: true });

const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);

export default Feedback;
