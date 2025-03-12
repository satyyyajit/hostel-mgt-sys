import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    date: {
        type: Date,
        default: Date.now,
    },
    

    admin: {
        type: String,
        ref: "Admin",
        required: true,
    },
});

const Notice = mongoose.models.Notice || mongoose.model("Notice", noticeSchema);

export default Notice;