import cloudinary from "../lib/cloudinary.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";

export const getUsers = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const filteredUser = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUser);
    } catch (error) {
        console.log(`Error in src/controllers/message.controller.js/getUsers: ${error}`);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: chatPartner } = req.params;
        const userId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: chatPartner },
                { senderId: chatPartner, receiverId: userId }
            ]
        });

        return res.status(200).json(messages);
    } catch (error) {
        console.log(`Error in src/controllers/message.controller.js/getMessages: ${error}`);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: chatPartner } = req.params;
        const userId = req.user._id;

        let imageUrl;

        if (image) {
            const cloudinaryUpload = await cloudinary.uploader.upload(image);
            imageUrl = cloudinaryUpload.secure_url;
        }

        const newMessage = new Message({
            senderId: userId,
            receiverId: chatPartner,
            text,
            image: imageUrl
        });

        await newMessage.save();

        return res.status(201).json(newMessage);
    } catch (error) {
        console.log(`Error in src/controllers/message.controller.js/sendMessage: ${error}`);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}