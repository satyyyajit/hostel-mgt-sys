import mongoose from 'mongoose';



const bookingSchema = new mongoose.Schema({
    room: {
        type: String,
        required: true,
        trim: true,
        ref: 'Room',
    },
    roomId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },
    roomType:{
        type: Number,
        required: true,
        enum: [2,4]
    },
    messType:{
        type: String,
        required: true,
        enum: ['Veg','NonVeg']
    },
    email:{
        type: String,
        required: true,
        ref: 'Student',
        unique: true
    },
    studentId: {
        type: String,
        ref: 'Student',
        required: true,
        trim: true,
        unique: true

    },
    bookingDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['approved','pending'],
        default: 'pending'
    },

    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Fee',
        default: null
    },

    active:{
        type: Boolean,
        default: true
    },
}, { timestamps: true });


const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking