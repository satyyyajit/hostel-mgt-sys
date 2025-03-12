import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minLength: [2, 'Name must be at least 2 characters']
    },
    studentId: {
        type: String,
        required: [true, 'Student ID is required'],
        unique: true,
        trim: true
    },
    year: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    dob: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    gender: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
    },
    parentPhoneNumber: {
        type: String,
        required: [true, 'Parent phone number is required'],
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
    },
    mess: {
        type: String,
        default: null
    },
    block: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HostelBlock',
        default: null
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        default: null
    },
    fees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fee'
    }],
    complaints: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint'
    }],
    leaves: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Leave'
    }],
    feedback: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feedback'
    }],
    role: {
        type: String,
        required: true,
        default: 'student',
    },
    gym:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gym',
        default: null
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        default: null
    }
}, {
    timestamps: true
});

// Add indexes for frequently queried fields


studentSchema.index({ studentId: 1, email: 1 });

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

export default Student;