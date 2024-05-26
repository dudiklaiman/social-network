import mongoose from 'mongoose';


const postSchema = new mongoose.Schema({
    description: String,
    picture: {
        url: String,
        identifier: String,
    },
    user: { type: mongoose.Schema.Types.ObjectId },
    likes: { type: Map, of: Boolean, default: {} },
    comments: [{ type: mongoose.Schema.Types.ObjectId }],
}, { timestamps: true, versionKey: false });


const PostModel = mongoose.model('posts', postSchema);
export default PostModel;
