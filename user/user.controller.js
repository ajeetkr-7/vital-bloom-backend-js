import asyncHandler from "express-async-handler";
import { User } from "../user/user.model.js";

export const getProfile = asyncHandler(async (req, res, next) => {
    const u = await User.findById(req.user._id).exec();
    return res.json(u);
});

export const updateProfile = asyncHandler(async (req, res, next) => {
    const { name, age, weight, height, sex } = req.body;
    let level = 0;
    if (req.user.level === 0) {
        level = 1;
    } else {
        level = req.user.level;
    }
    const note = await User.findOneAndUpdate({ _id: req.user._id }, { name, age, weight, height, sex, level }, { returnOriginal: false });
    if (note) {
        res.status(201).json(note);
    } else {
        res.status(500).json("Profile couldn't be updated");
    }
});


export const updateGeneralUserInfo = asyncHandler(async (req, res, next) => {
    const { smoking, drinking, workoutFrequency, stressLevel, constantlyTired, exerciseDuration, sleepAlarmingSign, snoring } = req.body;
    let userId = req.user._id;
    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    "healthInfo.smoking": smoking,
                    "healthInfo.drinking": drinking,
                    "healthInfo.workoutFrequency": workoutFrequency,
                    "healthInfo.stressLevel": stressLevel,
                    "healthInfo.constantlyTired": constantlyTired,
                    "healthInfo.exerciseDuration": exerciseDuration,
                    "healthInfo.sleepAlarmingSign": sleepAlarmingSign,
                    "healthInfo.snoring": snoring,
                },
            },
            { new: true } // Return the updated document
        );

        if (updatedUser) {
            let strLevel = updatedUser.level.toString();
            if ((strLevel[0] == '1')) {
                if (updatedUser.level == 1.23) {
                    updatedUser.level = 2;
                } else if (updatedUser.level === 1) {
                    updatedUser.level = 1.1;
                } else if (updatedUser.level === 1.2) {
                    updatedUser.level = 1.12;
                } else if (updatedUser.level === 1.3) {
                    updatedUser.level = 1.13;
                }
                await updatedUser.save();
            }
            res.status(201).json(updatedUser);
        } else {
            res.status(404).json("User not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json("Server error");
    }
});

export const updateJobDetails = asyncHandler(async (req, res, next) => {
    const { workStatus, workTime, satisfaction } = req.body;
    let userId = req.user._id;
    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    "healthInfo.jobDetails.workStatus": workStatus,
                    "healthInfo.jobDetails.workTime": workTime,
                    "healthInfo.jobDetails.satisfaction": satisfaction,
                },
            },
            { new: true } // Return the updated document
        );

        if (updatedUser) {
            let strLevel = updatedUser.level.toString();
            if ((strLevel[0] === '1')) {
                if (updatedUser.level == 1.12) {
                    updatedUser.level = 2;
                } else if (updatedUser.level == 1) {
                    updatedUser.level = 1.3;
                } else if (updatedUser.level === 1.1) {
                    updatedUser.level = 1.13;
                } else if (updatedUser.level === 1.2) {
                    updatedUser.level = 1.23;
                }
                await updatedUser.save();
            }
            res.status(201).json(updatedUser);
        } else {
            res.status(404).json("User not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json("Server error");
    }
});


export const updatePhysicalDetails = asyncHandler(async (req, res, next) => {
    const { waistSize, bloodPressure, neckSize, hipSize } = req.body;
    let userId = req.user._id;
    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    "healthInfo.bodyDetails.waistSize": waistSize,
                    "healthInfo.bodyDetails.bloodPressure": bloodPressure,
                    "healthInfo.bodyDetails.neckSize": neckSize, // Update with space in field name
                    "healthInfo.bodyDetails.hipSize": hipSize,
                },
            },
            { new: true } // Return the updated document
        );

        if (updatedUser) {
            let strLevel = updatedUser.level.toString();
            if ((strLevel[0] === '1')) {
                if (updatedUser.level == 1.13) {
                    updatedUser.level = 2;
                } else if (updatedUser.level == 1) {
                    updatedUser.level = 1.2;
                } else if (updatedUser.level === 1.1) {
                    updatedUser.level = 1.12;
                } else if (updatedUser.level === 1.3) {
                    updatedUser.level = 1.23;
                }
                await updatedUser.save();
            }
            res.status(201).json(updatedUser);
        } else {
            res.status(404).json("User not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json("Server error");
    }
});

const checkAndUpdateLevel = (user) => {
    const healthInfo = user.healthInfo;
    const allFieldsFilled = [
        healthInfo.smoking !== null,
        healthInfo.drinking !== null,
        healthInfo.workoutFrequency !== null,
        healthInfo.stressLevel !== null,
        healthInfo.jobDetails.workStatus !== null,
        healthInfo.jobDetails.workTime !== null,
        healthInfo.jobDetails.satisfaction !== null,
        healthInfo.bodyDetails.waistSize !== null,
        healthInfo.bodyDetails.bloodPressure !== null,
        healthInfo.bodyDetails.neckSize !== null, // Check with space in field name
        healthInfo.bodyDetails.hipSize !== null,
        healthInfo.constantlyTired !== null,
        healthInfo.exerciseDuration !== null,
        healthInfo.sleepAlarmingSign !== null,
        healthInfo.snoring !== null,
    ];

    if (allFieldsFilled.every(fieldFilled => fieldFilled)) {
        return true;
    } else {
        return false;
    }
}

