import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateJwtToken } from "../utils/utils.js";

export const signup = async (req, res) => {
    const { firstName, lastName, email, password, profilePic } = req.body;
    try {

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        if (password?.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: "Email already exists"
            })
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        if (!newUser) {
            return res.status(400).json({
                message: "Unable to create user. Try again!"
            })
        }

        generateJwtToken(newUser._id, res);
        await newUser.save();

        res.status(201).json({
            _id: newUser._id,
            firstName,
            lastName,
            profilePic
        });

    } catch (error) {
        console.error(`Error in src/controllers/auth.controller.js/signup: ${error}`);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
};

export const login = async (req, res) => {
};

export const logout = async (req, res) => {
};