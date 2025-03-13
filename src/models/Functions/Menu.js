import mongoose from "mongoose";


const menuSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true,
        unique: true
    },
    breakfast: {
        type: String,
        required: true
    },
    lunch: {
        type: String,
        required: true
    },
    snacks: {
        type: String,
        required: true
    },
    dinner: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Menu = mongoose.models.Menu || mongoose.model('Menu', menuSchema);

export default Menu;