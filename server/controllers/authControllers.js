import UserModel from '../models/userModel.js';
import { encryptPassword, comparePassword } from '../utils/passwordEncryption.js';
import { validateLogin, validateRegister } from '../validations/userValidations.js';
import { createToken } from '../utils/createToken.js';
import { uploadImage } from '../utils/uploadImage.js';


const configPopulateFriends = {
    path: 'friends',
    model: UserModel,
    select: '-password'
}

export const register = async (req, res) => {
    const validBody = validateRegister(req.body)
    if (validBody.error) return res.status(400).json(validBody.error.details);

    try {
        const user = new UserModel(req.body);

        if (req.files) {
            const uploadedImage = await uploadImage(req.files.picture, "users");
            user.picture.url = uploadedImage.secure_url;
            user.picture.identifier = uploadedImage.public_id;
            user.picture.createdAt = uploadedImage.created_at;
        }

        user.password = await encryptPassword(user.password);
        user.email = user.email.toLowerCase();

        await user.save();

        res.status(201).json({ message: "successfully created user"});
    }
    catch (error) {
        if (error.code == 11000) return res.status(400).json({ message: "Email already exists" });
        res.status(500).json({ error })
    }
}

export const login = async (req, res) => {
    const validBody = validateLogin(req.body)
    if (validBody.error) return res.status(400).json(validBody.error.details);

    try {
        const user = await UserModel.findOne({ email: req.body.email.toLowerCase() });
        if (!user) return res.status(401).json({ message: "Wrong email or password" });

        const isMatching = await comparePassword(req.body.password, user.password);
        if (!isMatching) return res.status(401).json({ message: "Wrong email or password" });

        const userToReturn = await UserModel
            .findById(user._id)
            .select("-password")
            .populate(configPopulateFriends);

        const token = createToken(user.id);

        res.status(200).json({ token, user: userToReturn });
    }
    catch (error) {
        res.status(500).json({ error })
    }
}
