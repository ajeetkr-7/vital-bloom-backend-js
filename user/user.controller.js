import asyncHandler from "express-async-handler";
import { User } from "../user/user.model.js";

export const getProfile = asyncHandler(async (req,res,next)=>{
    const u =  await User.findById(req.user._id).exec();
    return res.json(u);
});

export const updateProfile = asyncHandler(async (req,res,next)=>{
    const {firstName,email} = req.body;
    const note = await User.findOneAndUpdate({_id: req.user._id},{firstName,email},{returnOriginal:false} );
    if(note){
        res.json(note);
    }else{
        res.status(500).json("Profile couldn't be updated");
    }
});
