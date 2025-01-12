import express from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { getMessages, getUsers, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.route("/users").get(isLoggedIn, getUsers);
router.route("/:id").get(isLoggedIn, getMessages);
router.route("/send/:id").post(isLoggedIn, sendMessage);

export default router;