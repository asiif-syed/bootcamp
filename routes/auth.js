import express from "express";
import { forgotPassword, getLoggedinUser, loginUser, logout, register } from "../controllers/auth";
import { isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", loginUser);
router.get("/get-user", isAuthenticated, getLoggedinUser);
router.post("/forgot-password", forgotPassword);
router.get("/logout", logout);

export default router;
