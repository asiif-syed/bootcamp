import express from "express";
import { getLoggedinUser, loginUser, register } from "../controllers/auth";
import { isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", loginUser);
router.get("/get-user", isAuthenticated, getLoggedinUser);

export default router;
