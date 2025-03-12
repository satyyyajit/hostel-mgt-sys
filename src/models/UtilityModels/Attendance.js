import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    room: {
        type: String,
        ref: 'Room',
        required
    },
    block: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'leave'],
        required: true
    },
    takenBy: {
        type: String,
        required: true,

    }

}, { timestamps: true });


const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);

export default Attendance;