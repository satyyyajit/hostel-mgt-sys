const mongoose = require('mongoose');


// this is room schema
const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true
    },
    roomType: {
        type: Number,
        enum: [2, 4], // 2-seater or 4-seater
        required: true
    },
    floor: {
        type: Number,
        required: true
    },
    hostelBlock: {
        type: String,
        required: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    isVacant: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

roomSchema.virtual('vacancyStatus').get(function () {
    return this.students.length < this.roomType;
});

roomSchema.pre('save', function (next) {
    this.isVacant = this.students.length < this.roomType;
    next();
});

roomSchema.methods.updateVacancy = function () {
    this.isVacant = this.students.length < this.roomType;
    return this.save();
};

const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);

export default Room;