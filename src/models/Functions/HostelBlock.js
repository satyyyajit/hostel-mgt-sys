import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const HostelBlockSchema = new Schema({
    blockName: {
        type: String,
        required: true
    },
}, { timestamps: true
});

const HostelBlock = mongoose.models.HostelBlock || mongoose.model('HostelBlock', HostelBlockSchema);

export default HostelBlock;