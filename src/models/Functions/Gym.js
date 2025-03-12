const mongoose = require('mongoose');
const { Schema } = mongoose;

// delete schema again if it already exists, then recreate it

const gymSchema = new Schema({
    room: {
        type: String,
        required: true,
        default: "G07"
    },
    occupiedNumber: {
        type: Number,
        default: 0
    },
    maxCapacity: {
        type: Number,
        default: 20
    },
    equipment: {
        type: String,
        required: true,
        default: "Dumbbells, Treadmill, Bench Press, Squat Rack, Pull-up Bar"
    },
    studentId: {
        type: String,
        ref: 'Student',
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 1000
    },
    subscriptionExpiry: {
        type: Date,
        required: true,
        default: () => {
            const date = new Date();
            date.setMonth(date.getMonth() + 10);
            return date;
        },
        index: { expires: 0 }
    },
    active:{
        type: Boolean,
        default: false,
        required: true
    }
}, { timestamps: true });

gymSchema.index({ subscriptionExpiry: 1 }, { expireAfterSeconds: 0 });

const Gym = mongoose.models.Gym || mongoose.model('Gym', gymSchema);

export default Gym;