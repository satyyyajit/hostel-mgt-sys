import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({
    studentId: {
        type: String,
        ref: 'Student',
        required: true
    },
    type: {
        type: String,
        enum: ['RoomMessFee', 'GymFee', 'Fine'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    
    status: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    },
    dueDate: {
        type: Date,
        required: true,
        default: () => {
            const date = new Date();
            date.setDate(date.getDate() + 30);
            return date;
        }
    }
}, { timestamps: true });

const Fee = mongoose.models.Fee || mongoose.model('Fee', feeSchema);

export default Fee;