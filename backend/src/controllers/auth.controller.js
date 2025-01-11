import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateJwtToken } from "../utils/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { firstName, lastName, email, password, profilePic } = req.body;
    try {

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
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
            });
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
            });
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
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Either email or password is wrong"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Either email or password is wrong"
            });
        }

        generateJwtToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            profilePic: user.profilePic
        });
    } catch (error) {
        console.log(`Error in src/controllers/auth.controller.js/login: ${error}`);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const logout = async (req, res) => {
    try {
        // const options = {
        //     maxAge: 0,
        // }
        // res.cookie("token","",options);
        res.clearCookie("token");
        res.status(200).json({
            message: "Logged out successfully"
        });
    } catch (error) {
        console.log(`Error in src/controllers/auth.controller.js/logout: ${error}`);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const updateProfile = async (req, res) => {
    const { profilePic } = req.body;
    const user = req.user;
    try {
        if (!profilePic) {
            return res.status(400).json({
                message: "Please provide a image to upload"
            });
        }

        const cloudinaryResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findOneAndUpdate(user._id, { profilePic: cloudinaryResponse.secureUrl }, { new: true });

        return res.status(200).json({
            updatedUser
        });
    } catch (error) {
        console.log(`Error in src/controllers/auth.controller.js/updateProfile: ${error}`);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export const checkAuth = (req,res)=>{
    try {
        return res.status(200).json(req.user);
    } catch (error) {
        console.log(`Error in src/controllers/auth.controller.js/checkAuth: ${error}`);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}