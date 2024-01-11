import UserModel from '../models/userModel.js';


export const getUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await UserModel.findById(userId);
        user.password = "********";
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
      .find({
        $or: [
          { name: { $regex: query, $options: 'i' } }
        ],
      })
      .select('name picturePath');
  
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
            .populate(
                {
                    path: 'friends',
                    model: UserModel,
                    select: '-password'
                },
            );
        res.json(friends);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}


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
            .populate(
                {
                    path: 'friends',
                    model: UserModel,
                    select: '-password'
                },
            );

        res.status(200).json(friends);
    }
    catch (err) {
        res.status(404).json({ message: err.message });
    }
}