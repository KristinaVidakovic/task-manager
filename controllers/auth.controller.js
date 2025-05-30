import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const { JWT_SECRET, JWT_EXPIRES } = process.env;

const register = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { email, password } = req.body;
        if (!password) {
            return res.status(400).json({
                error: "Password is required"
            });
        }
        const [existingUser] = await Promise.all([User.findOne({ email })]);
        if (existingUser) {
            return res.status(400).json({
                error: "User already exists",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = await User.create([{ email, password: hash}], { session });
        const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

        await session.commitTransaction();
        const userWithoutPass = await User.findById(newUser[0]._id).select("-password");
        await session.endSession();

        res.status(201).json({
            message: "User successfully registered",
            token,
            user: userWithoutPass
        })
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        next(error);
    }
}

export { register }