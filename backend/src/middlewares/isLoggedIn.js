import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const isLoggedIn = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized access - No token provided"
            });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedToken) {
            return res.status(401).json({
                message: "Unauthorized access - Invalid token"
            });
        }

        const user = await User.findOne({ _id: decodedToken.userId }).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(`Error in src/middleware/isLoggedIn.js/isLoggedIn: ${error}`);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}