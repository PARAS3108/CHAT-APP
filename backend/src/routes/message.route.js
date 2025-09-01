import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar,getMessages,sendMessage } from "../controller/message.controller.js";

const router = express.Router();

router.get("/user", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage); //here id is the id of user to whom we want to send messages
export default router;
