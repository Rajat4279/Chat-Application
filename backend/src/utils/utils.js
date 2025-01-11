import jwt from "jsonwebtoken";

export const generateJwtToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

    const options = {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, //for XSS
        sameSite: "strict", //for CSRF
        secure: process.env.NODE_ENV != "development"
    }
    res.cookie("token", token, options);
    return token;
}