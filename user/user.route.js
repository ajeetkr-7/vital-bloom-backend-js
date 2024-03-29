import { Router } from "express";
import { protect } from "../utils/middleware.js";
import { getProfile, updateProfile, updatePhysicalDetails, updateGeneralUserInfo, updateJobDetails } from "./user.controller.js";
const router = Router();

router.use(protect);
router.get('/profile/:id', getProfile);
router.patch('/profile/:id', updateProfile);
router.patch('/profile/generalInfo/:id', updateGeneralUserInfo);
router.patch('/profile/physicalDetails/:id', updatePhysicalDetails);
router.patch('/profile/jobDetails/:id', updateJobDetails);


export default router;
