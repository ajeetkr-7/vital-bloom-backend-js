import { Router } from "express";
import { protect } from "../utils/middleware.js";
import { getProfile, updateProfile } from "./user.controller.js";
const router = Router();

router.use(protect);
router.get('/profile/:id', getProfile);
router.patch('/profile/:id', updateProfile);

export default router;
