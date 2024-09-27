import UserModel from '../models/userModel.js';
import PostModel from '../models/postModel.js';
import CommentModel from '../models/commentModel.js';
import { createToken } from '../utils/createToken.js';
import { encryptPassword } from '../utils/passwordEncryption.js';
import { deleteImage, uploadImage } from '../utils/uploadImage.js';
import { validateUpdate } from '../validations/userValidations.js';


const configPopulateFriends = {
    path: 'friends',
    model: UserModel,
    select: '-password'
}

export const getUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await UserModel
            .findById(userId)
            .select("-password")
            .populate(configPopulateFriends);

        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ error });
    }
}

export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;

        const searchResults = await UserModel
            .find({ name: { $regex: query, $options: 'i' } })
            .select('name picture');

        // Sort the results based on name similarity to the query
        searchResults.sort((a, b) => {
            const scoreA = a.name.toLowerCase().startsWith(query.toLowerCase()) ? 2 : 1;
            const scoreB = b.name.toLowerCase().startsWith(query.toLowerCase()) ? 2 : 1;
            return scoreB - scoreA; // Sort in descending order
        });

        res.status(200).json(searchResults);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};

export const getUserFriends = async (req, res) => {
    try {
        const { userId } = req.params;

        const { friends } = await UserModel
            .findById(userId)
            .populate(configPopulateFriends);

        res.json(friends);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};

export const addRemoveFriend = async (req, res) => {
    try {
        const { userId, friendId } = req.params;

        const user = await UserModel.findById(userId);
        const friend = await UserModel.findById(friendId);

        if (user.friends.includes(friend._id)) {
            user.friends.pull(friend._id);
            friend.friends.pull(user._id);
        }
        else {
            user.friends.push(friend._id);
            friend.friends.push(user._id);
        }

        await user.save();
        await friend.save();

        const { friends } = await UserModel
            .findById(userId)
            .populate(configPopulateFriends);

        res.status(200).json(friends);
    }
    catch (error) {
        res.status(500).json({ error });
    }
};

export const editProfile = async (req, res) => {
    const validBody = validateUpdate(req.body)
    if (validBody.error) return res.status(400).json(validBody.error.details);

    try {
        const { userId } = req.params;

        if (req.tokenData._id != userId) return res.status(403).json({ message: "You cannot modify another user's information" });

        const existingUser = await UserModel.findOne({ email: req.body.email });
        if (existingUser && existingUser._id != userId) {
            return res.status(409).json({ message: "Email already in use" });
        }

        if (req.body?.password) req.body.password = await encryptPassword(req.body.password);

        let updatedUser = await UserModel.findByIdAndUpdate(userId, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.files) {
            if (updatedUser.picture) {
                await deleteImage(updatedUser.picture.identifier);
            }

            const uploadedImage = await uploadImage(req.files.picture, "users");
            if (!uploadedImage) {
                return res.status(500).json({ message: 'Image upload failed' });
            }

            const pictureUpdate = {
                "picture.url": uploadedImage.secure_url,
                "picture.identifier": uploadedImage.public_id,
                "picture.createdAt": uploadedImage.created_at
            };

            updatedUser = await UserModel
                .findByIdAndUpdate(userId, { $set: pictureUpdate }, { new: true })

            if (!updatedUser) {
                return res.status(500).json({ message: 'Failed to update picture' });
            }
        }

        const userToReturn = await UserModel
            .findById(userId)
            .select("-password")
            .populate(configPopulateFriends);

        const token = createToken(userId);

        res.status(200).json({ token: token, user: userToReturn });
    }
    catch (error) {
        res.status(500).json({ error });
    }
};


export const deleteProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!req.tokenData._id.equals(userId)) return res.status(403).json({ error: "cannot delete another user's account" });

        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Delete the user's profile picture
        if (user.picture) await deleteImage(user.picture.identifier);

        // Delete the user's id from all friends
        await UserModel.updateMany(
            { _id: { $in: user.friends } },
            { $pull: { friends: user._id } }
        );

        // Delete all user's comments
        await CommentModel.deleteMany({ user: userId });

        // Delete all user's posts pictures
        const userPosts = await PostModel.find({ user: userId });
        for (const post of userPosts) {
            if (post.picture) await deleteImage(post.picture.identifier);
        }

        // Delete all user's posts
        await PostModel.deleteMany({ user: userId });

        // Delete the user itself
        await UserModel.findByIdAndDelete(userId);

        res.status(200).json({ "deleted user": userId });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
