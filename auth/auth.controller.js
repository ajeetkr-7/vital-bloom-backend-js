import asyncHandler from "express-async-handler";
import { User } from "../user/user.model.js";
import CONFIG from "../utils/config.js";
import { OAuth2Client } from 'google-auth-library';
import logger from "../utils/logger.js";

const client = new OAuth2Client(CONFIG.GOOGLE_CLIENT_ID, CONFIG.GOOGLE_CLIENT_SECRET);

const verifyGoogleToken = asyncHandler(async (req, res) => {
    const { idToken } = req.body;
    let ticket;
    try {
        ticket = await client.verifyIdToken({ idToken });
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid ID token' });
    }

    const payload = ticket.getPayload();
    console.log(payload);

    const { sub: googleId, email, name: name, picture: picture } = payload;
    console.log(googleId, email, name, picture);
    let user = await User.findOne({ googleId });
    if (!user) {
        // New user, register with additional information
        user = new User({
            googleId,
            email,
            name,
            picture,
        });
        await user.save();
    }
    return res.json(user);
});


const logout = asyncHandler(async (req, res) => {
    res.clearCookie('jwt');
    res.user = null;
    res.sendStatus(200);
});




export { logout, verifyGoogleToken };