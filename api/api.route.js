import { Router } from "express";
import { calculateHealthScore, searchUsers, } from "./api.controller.js";
import { protect } from "../utils/middleware.js";
import { createGroup, sendGroupInvite, acceptGroupInvite, getGroupData, getGroupUser } from "./group.controller.js";
const router = Router();

router.get('/health-score', protect, calculateHealthScore)
router.get('/search-users', protect, searchUsers)
router.post('/group/create', protect, createGroup)
router.post('/group/send-invite', protect, sendGroupInvite)
router.post('/group/accept-invite', protect, acceptGroupInvite)
router.get('/group', protect, getGroupData)
router.get('/group/:groupId/user/:userId', protect, getGroupUser)

export default router; 