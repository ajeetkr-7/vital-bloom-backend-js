import asyncHandler from "express-async-handler";
import { User } from "../user/user.model.js";


const calculateHealthScore = asyncHandler(async (req, res) => {
    let user = req.user;
    const healthInfo = user.healthInfo;
    console.log(healthInfo);
    // Define weights for each field (adjust these values based on your expertise)
    const weights = {
        smoking: 1, // Higher smoking value means lower score
        drinking: 1, // True indicates potential health risk (reduce score)
        workoutFrequency: 1, // Higher frequency increases score
        stressLevel: 1, // Higher stress level reduces score
        jobDetails: {
            workTime: 1, // Longer work hours might reduce score (gradually)
            satisfaction: 1, // Higher satisfaction increases score
        },
        exerciseDuration: 1, // Higher duration increases score
    };

    let totalScore = 0;
    totalScore += (10 - healthInfo['smoking']);
    if (!healthInfo['drinking']) totalScore += 10;
    totalScore += (healthInfo['workoutFrequency'] / 20) + 5;
    let stressLevel = healthInfo['stressLevel'];
    totalScore += (Math.sqrt(100 - (stressLevel * stressLevel))) - 10
    let workTime = healthInfo['jobDetails']['workTime'];
    let satisfaction = healthInfo['jobDetails']['satisfaction'];
    totalScore += (workTime * satisfaction / 1.6) / 2;

    if (healthInfo['workoutFrequency'] != 0) {
        totalScore += healthInfo['exerciseDuration'] * 10 / 4 * ((healthInfo['workoutFrequency'] / 20) + 5) / 10;
        totalScore /= 6;
    } else {
        totalScore /= 5;
    }

    totalScore * 100;
    let data = calculateMatrix(user);

    return res.json({ score: totalScore, ...data });
});

const calculateMatrix = (user) => {
    let weight = user.weight;
    let height = user.height;
    let smoking = user.healthInfo.smoking;
    let bmi = weight / (height * height) * 10000;
    let wc = user.healthInfo.bodyDetails.waistSize;
    let hc = user.healthInfo.bodyDetails.hipSize;
    console.log(bmi, wc, hc, height, weight);
    let absi = wc / 100 / (Math.pow(bmi, 2 / 3) * Math.pow(height / 100, 1 / 2));
    let addiction_start_age = user.healthInfo.smokingStartAge;
    let sex = user.sex;
    let age = user.age;
    let neckSize = user.healthInfo.bodyDetails.neckSize;
    let constantlyTired = user.healthInfo.constantlyTired;
    let sleepAlarmingSign = user.healthInfo.sleepAlarmingSign;
    let absi_z_score = 0;
    let absi_sd = 0;
    let absi_mean = 0;

    if (sex === "Male") {
        absi_mean = age * 0.0001 + 0.0764;
        // absi_sd = -4 * Math.exp(-6) * age + 0.0038;
        absi_sd = -0.000003 * age + 0.0038;
    }
    else {
        absi_mean = 8 * Math.exp(-5) * (age) + 0.0766;
        absi_sd = 2 * Math.exp(-5) * age + 0.0037;
    }
    console.log(absi, absi_mean, absi_sd);
    absi_z_score = (absi - absi_mean) / absi_sd;
    let total_life_lost = (14.1 * smoking) * (80 - addiction_start_age) / (60 * 24);
    let whr = wc / hc;
    let osa_score = 0;
    let snoring = user.healthInfo.snoring;
    if (snoring) { osa_score += 1; };
    if (sex === "Male") { osa_score += 1; };
    if (age >= 50) { osa_score += 1; };
    if (bmi > 35) { osa_score += 1; };
    if (neckSize > 43 && sex === "Male") { osa_score += 1; }
    else if (neckSize > 41) { osa_score += 1; };
    if (constantlyTired) { osa_score += 1; };
    if (sleepAlarmingSign) { osa_score += 1; };

    return {
        absi_z_score: absi_z_score,
        total_life_lost: total_life_lost,
        whr: whr,
        osa_score: osa_score
    };

}


const searchUsers = asyncHandler(async (req, res) => {
    const { name, email } = req.query; // Get search parameters

    const searchQuery = {};
    if (name) {
        searchQuery.name = new RegExp(name, 'i'); // Case-insensitive search
    }
    if (email) {
        searchQuery.email = email;
    }

    const users = await User.find(searchQuery, { healthInfo: 0 }); // Exclude healthInfo for efficiency
    // remove my own user from the list
    let me = req.user;
    users = users.filter((user) => user._id != me._id);
    let u = users.map((user) => {
        return {
            name: user.name,
            email: user.email,
            picture: user.picture,
            level: user.level,
        }
    });
    res.status(200).json(u);
});


const sendFriendRequest = asyncHandler(async (req, res) => {
    const { userId } = req.params; // User ID to send request to
    const senderId = req.user._id; // Sender ID from JWT payload

    if (senderId === userId) {
        return res.status(400).json({ message: 'Cannot send request to yourself' });
    }
    const sender = req.user;
    const receiver = await User.findById(userId);

    if (!sender || !receiver) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (sender.friends.includes(userId) || receiver.friends.includes(senderId)) {
        return res.status(400).json({ message: 'Already friends or request pending' });
    }

    sender.friendRequestsSent.push(userId);
    receiver.friendRequestsReceived.push(senderId); // Add request to receiver

    await sender.save();
    await receiver.save();

    res.status(201).json({ message: 'Friend request sent successfully' });
});


const acceptFriendRequest = asyncHandler(async (req, res) => {
    const { userId, requestId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const friendIndex = user.friendRequestsReceived.indexOf(requestId);
        if (friendIndex === -1) {
            return res.status(400).json({ message: 'Invalid friend request' });
        }

        const friendId = user.friendRequestsReceived[friendIndex];
        user.friendRequestsReceived.splice(friendIndex, 1); // Remove request
        user.friends.push(friendId);

        const friend = await User.findById(friendId);
        friend.friends.push(userId);

        await user.save();
        await friend.save();

        res.status(200).json({ message: 'Friend request accepted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error accepting friend request' });
    }
});



export { calculateHealthScore, searchUsers, sendFriendRequest, acceptFriendRequest };