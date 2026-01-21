import express from "express";
import { signUp, signIn, getMe } from "../controllers/auth.controller.js";
import { verifyAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", signIn);
router.get("/me", verifyAuth, getMe);

export default router;
