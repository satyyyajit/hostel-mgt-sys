import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    },
    room: {
        type: String,
        ref: 'Room',
        required
    },
    block: {
        type: String,
    },
    date: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'leave'],
    },
    takenBy: {
        type: String,
    }

}, { timestamps: true });


const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);

export default Attendance;