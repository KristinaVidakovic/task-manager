import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email.']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;