import CommentModel from '../models/commentModel.js';
import PostModel from '../models/postModel.js'
import UserModel from '../models/userModel.js';
import { validateCreatePost } from '../validations/postValidation.js'
import { uploadImage, deleteImage } from '../utils/uploadImage.js';


const configPopulate = [
    {
        path: 'user',
        model: UserModel,
        select: '-password'
    },
    {
        path: 'comments',
        model: CommentModel,
        populate: {
            path: 'user',
            model: UserModel,
            select: '-password'
        }
    },
];

export const createPost = async (req, res) => {
    const validBody = validateCreatePost(req.body)
    if (validBody.error) return res.status(400).json(validBody.error.details);

    try {
        const post = new PostModel(req.body);

        if (req.files) {
            const uploadedImage = await uploadImage(req.files.picture, "posts");
            post.picture.url = uploadedImage.secure_url;
            post.picture.identifier = uploadedImage.public_id;
        }

        post.user = req.tokenData._id;

        await post.save();

        const allPosts = await PostModel
            .find()
            .sort({ createdAt: -1 })
            .populate(configPopulate);

        res.status(201).json(allPosts);
    }
    catch (error) {
        res.status(500).json({ error });
    }
}

export const getPostsFeed = async (req, res) => {
    try {
        const allPosts = await PostModel
            .find()
            .sort({ createdAt: -1 })
            .populate(configPopulate);

        res.status(200).json(allPosts);
    }
    catch (error) {
        res.status(500).json({ error });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;

        const posts = await PostModel
            .find({ user: userId })
            .sort({ createdAt: -1 })
            .populate(configPopulate);

        res.status(200).json(posts);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};

export const likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.tokenData._id;

        const post = await PostModel.findById(postId);
        if (!post) return res.status(404).json({ message: "post not found" });

        const isLiked = post.likes.get(userId);
        isLiked ? post.likes.delete(userId) : post.likes.set(userId, true);

        await post.save();

        const updatedPost = await PostModel
            .findById(postId)
            .populate(configPopulate);

        res.status(200).json(updatedPost);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        
        const post = await PostModel.findById(postId);
        if (!post) return res.status(404).json({ message: "post not found" });

        if (!req.tokenData._id.equals(post.user)) return res.status(403).json({ message: "You cannot delete another user's post" });

        await CommentModel.deleteMany({ post: postId });
        if (post.picture.identifier) {
            await deleteImage(post.picture.identifier);
        }
        await PostModel.findByIdAndDelete(postId);

        res.status(200).json({ message: "Post deleted successfully"});
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
