import mongoose from 'mongoose';


const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    empId: {
        type: String,
        required: [true, 'Employee ID is required'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password should be at least 6 characters']
    },
    dob: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    contact: {
        type: Number,
        required: [true, 'Contact number is required'],
        validate: {
            validator: function(v) {
                return /\d{10}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
    },
    role: {
        type: String,
        required: [true, 'Role is required'],
        enum: ['admin', 'warden'],
        default: 'admin'
    },
    hostelBlock: {
        type: String,
        required: [true, 'Hostel block is required'],
        trim: true
    }
}, {
    timestamps: true
});

// Create indexes for frequently queried fields
AdminSchema.index({ email: 1, empId: 1 });

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

export default Admin;