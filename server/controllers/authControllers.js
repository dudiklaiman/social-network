import UserModel from '../models/userModel.js';
import { encryptPassword, comparePassword } from '../services/passwordEncryption.js';
import { validateLogin, validateRegister } from '../services/userValidations.js';
import { createToken } from '../services/createToken.js';
// import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { uploadImage } from '../services/uploadImage.js';
dotenv.config();


// cloudinary.config({ 
//     cloud_name: process.env.CLOUD_NAME, 
//     api_key: process.env.API_KEY, 
//     api_secret: process.env.API_SECRET, 
// });

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
            const uploadedImage = await uploadImage(req.files.picture)
            user.picturePath = uploadedImage;
        }

        user.password = await encryptPassword(user.password);
        user.email = user.email.toLowerCase();
        await user.save();
        user.password = '*'.repeat(req.body.password.length);

        res.status(201).json(user);
    }
    catch (err) {
        if (err.code == 11000) return res.status(400).json({ error: "Email already in system", code:11000 });
        res.status(500).json({err})
    }
}


export const login = async (req, res) => {
    const validBody = validateLogin(req.body)
    if (validBody.error) return res.status(400).json(validBody.error.details);

    try {
        const user = await UserModel.findOne({ email: req.body.email.toLowerCase() });
        if (!user) return res.status(400).json({ msg: "User does not exist" });

        const isMatching = await comparePassword(req.body.password, user.password);
        if (!isMatching) return res.status(400).json({ msg: "Invalid credentials." });

        const userToReturn = await UserModel
            .findById(user._id)
            .select("-password")
            .populate(configPopulateFriends);

        const token = createToken(user.id);

        res.status(200).json({ token, user: userToReturn });
    }
    catch (err) {
        res.status(500).json({err})
    }
}
