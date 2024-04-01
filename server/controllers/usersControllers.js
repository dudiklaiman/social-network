import UserModel from '../models/userModel.js';
import { encryptPassword } from '../services/passwordEncryption.js';
import { deleteImage } from '../services/uploadImage.js';


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
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;
        const users = await UserModel
            .find({ name: { $regex: query, $options: 'i' } })
            .select('name picturePath');

        // Sort the results based on name similarity to the query
        users.sort((a, b) => {
            const scoreA = a.name.toLowerCase().startsWith(query.toLowerCase()) ? 2 : 1;
            const scoreB = b.name.toLowerCase().startsWith(query.toLowerCase()) ? 2 : 1;
            return scoreB - scoreA; // Sort in descending order
        });

        res.status(200).json(users);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
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
    catch (err) {
        res.status(404).json({ message: err.message });
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
    catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const editProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        if (req.tokenData._id != userId) return res.status(403).json({ error: "cannot modify another user's info" });

        if (req.body.password) req.body.password = await encryptPassword(req.body.password);

        const updatedUser = await UserModel
        .findByIdAndUpdate(userId, req.body, { new: true })

        deleteImage();

        res.status(200).json(updatedUser);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        if (req.tokenData._id != userId) return res.status(403).json({ error: "cannot delete another user's account" });
    
        const deletedUser = await UserModel.findByIdAndDelete(userId);
    
        res.status(200).json({ "deleted user": deletedUser });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};