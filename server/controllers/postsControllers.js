import PostModel from '../models/postModel.js'
import UserModel from '../models/userModel.js';
import { validateCreatePost } from '../services/postValidation.js'
import { v2 as cloudinary } from 'cloudinary';


cloudinary.config({
    cloud_name: 'dtk7xoyb4',
    api_key: '911992345193834',
    api_secret: 'ASs6JLTa5TKtfVTroWDw-ubmogs'
});


export const createPost = async (req, res) => {
    const validBody = validateCreatePost(req.body)
    if (validBody.error) return res.status(400).json(validBody.error.details);

    try {
        const post = new PostModel(req.body);

        if (req.files) {
            const reqFile = req.files.picture;
            const file = await cloudinary.uploader.upload(reqFile.tempFilePath, { unique_filename: true });
            post.picturePath = file.secure_url;
        }

        post.user = req.tokenData._id;

        await post.save();

        const allPosts = await PostModel
        .find()
        .sort({ createdAt: -1 })
        .populate({
            path: 'user',
            model: UserModel,
            select: '-password'
        });
        res.status(201).json(allPosts);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}


export const getPostsFeed = async (req, res) => {
    try {
        const allPosts = await PostModel
        .find()
        .sort({ createdAt: -1 })
        .populate({
            path: 'user',
            model: UserModel,
            select: '-password'
        });
        res.status(200).json(allPosts);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}


export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;


        const posts = await PostModel
        .find({ user: userId })
        .sort({ createdAt: -1 })
        .populate({
            path: 'user',
            model: UserModel,
            select: '-password'
        });
        res.status(200).json(posts);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
};


export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.tokenData._id;

        const post = await PostModel.findById(id);

        const isLiked = post.likes.get(userId);
        if (isLiked) {
            post.likes.delete(userId);
        }
        else {
            post.likes.set(userId, true);
        }

        const updatedPost = await PostModel
        .findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        )
        .populate({
            path: 'user',
            model: UserModel,
            select: '-password'
        });

        res.status(200).json(updatedPost);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
};
