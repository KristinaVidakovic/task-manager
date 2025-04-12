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
    if (!password || !email) {
      return res.status(400).json({
        error: "Password and email are required",
      });
    }
    if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)) {
      return res.status(400).json({
        error:
          "The password must be at least 8 characters long and consist of at least one number, one special character, one lowercase letter and one uppercase letter.",
      });
    }
    if (!email.match(/\S+@\S+\.\S+/)) {
      return res.status(400).json({
        error: "Email is not valid",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = await User.create([{ email, password: hash }], { session });
    const token = jwt.sign({ userId: newUser[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES,
    });

    await session.commitTransaction();
    const userWithoutPass = await User.findById(newUser[0]._id).select(
      "-password",
    );
    await session.endSession();

    res.status(201).json({
      message: "User successfully registered",
      token,
      user: userWithoutPass,
    });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: "User does not exist",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        error: "Invalid password",
      });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES,
    });

    const userWithoutPass = await User.findById(user._id).select("-password");

    res.status(200).json({
      message: "User successfully logged in",
      token,
      user: userWithoutPass,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export { register, login };
