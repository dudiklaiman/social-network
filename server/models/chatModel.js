import mongoose from 'mongoose';


const chatSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId }],
    messages: [{ type: mongoose.Schema.Types.ObjectId }],
}, { timestamps: true, versionKey: false });


const ChatModel = mongoose.model('chats', chatSchema);
export default ChatModel;
