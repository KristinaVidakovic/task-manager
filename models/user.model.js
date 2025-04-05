import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    password: {
        type: String
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;