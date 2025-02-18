import mongoose from 'mongoose';


const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    picture: {
        url: String,
        identifier: String,
        createdAt: { type: Date }
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId }],
    location: String,
    occupation: String,
}, { timestamps: true, versionKey: false })

const UserModel = mongoose.model('users', UserSchema);
export default UserModel;
