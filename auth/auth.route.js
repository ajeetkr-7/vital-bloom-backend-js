import { Router } from "express";
import { logout, verifyGoogleToken } from "./auth.controller.js";
import { protect } from "../utils/middleware.js";
const router = Router();

router.delete('/logout', protect, logout)
router.post('/verify-google-token', verifyGoogleToken)

export default router;