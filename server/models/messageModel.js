import mongoose from 'mongoose';


const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId },
    chat: { type: mongoose.Schema.Types.ObjectId },
    content: String,
    isSeen: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });


const MessageModel = mongoose.model('messages', messageSchema);
export default MessageModel;
