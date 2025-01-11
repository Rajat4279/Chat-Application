import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/updateProfile").put(isLoggedIn, updateProfile);
router.route("/check").get(isLoggedIn, checkAuth); // calling this controller whenever we refresh our page

export default router;