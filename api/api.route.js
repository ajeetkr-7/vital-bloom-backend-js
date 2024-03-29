import { Router } from "express";
import { calculateHealthScore , searchUsers, sendFriendRequest, acceptFriendRequest} from "./api.controller.js";
import { protect } from "../utils/middleware.js";
const router = Router();

router.get('/health-score', protect, calculateHealthScore)
router.get('/search-users', protect, searchUsers)
router.post('/send-friend-request/:userId', protect, sendFriendRequest)
router.post('/accept-friend-request/:userId/:requestId', protect, acceptFriendRequest)
export default router;