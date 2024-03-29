import asyncHandler from "express-async-handler";
import { Group } from "./group.model.js";
import { User } from "../user/user.model.js";


const createGroup = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const user = req.user;
    let groupExists = user.groupId !== null;
    if (groupExists) {
        return res.status(400).json({ message: 'User already belongs to a group' });
    }
    try {
        const group = new Group({ name, members: [user._id], admin: user._id });
        await group.save();

        user.groupId = group._id;
        await user.save();

        res.status(201).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating group' });
    }
});

const sendGroupInvite = async (req, res) => {
    const { userId, groupId } = req.body;
    if (!(groupId == req.user.groupId && req.user.groupId != null)) {
        return res.status(400).json({ message: 'User is not part of this groupId sent' });
    }

    try {
        const user = await User.findById(userId);
        const group = await Group.findById(groupId);

        if (!user || !group) {
            return res.status(404).json({ message: 'User or group not found' });
        }

        if (user.groupId) {
            return res.status(400).json({ message: 'User already belongs to a group' });
        }

        if (group.members.includes(userId)) {
            return res.status(400).json({ message: 'User is already in this group' });
        }

        // Implement logic to send invite notification (e.g., email, push notification)
        group.invitedUsers.push(userId);
        user.groupInvites.push(groupId);
        await group.save();
        await user.save();

        res.status(200).json({ message: 'Group invite sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending group invite' });
    }
};

const acceptGroupInvite = asyncHandler(async (req, res) => {
    const { groupId } = req.body;
    const user = req.user;

    const group = await Group.findById(groupId);
    if (!group) {
        return res.status(404).json({ message: 'Group not found' });
    }

    if (user.groupId) {
        return res.status(400).json({ message: 'User already belongs to a group' });
    }

    if (!group.invitedUsers.includes(user._id)) {
        return res.status(400).json({ message: 'Invalid invite or already declined' });
    }

    user.groupId = groupId;
    // empy user.groupInvites
    user.groupInvites = [];
    group.members.push(user._id);
    group.invitedUsers = group.invitedUsers.filter((id) => id != user._id);

    try {
        await user.save();
        await group.save();
        res.status(200).json({ message: 'Group invite accepted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error accepting group invite' });
    }
});


const getGroupData = asyncHandler(async (req, res) => {
    const groupId = req.user.groupId;
    if (groupId == null) {
        return res.status(400).json({ message: 'User does not belong to a group' });
    }
    try {
        const group = await Group.findById(groupId).populate('members'); // Populate user details

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        let members = group.members;
        // remove my own user from the list
        let me = req.user;
        console.log(me);
        console.log(members[0])
        members = members.filter((member) => member.email != me.email);
        res.status(200).json({
            groupId: group._id,
            name: group.name,
            members: members,
            admin: group.admin,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching group members' });
    }
});

const getGroupUser = asyncHandler(async (req, res) => {
    const { groupId, userId } = req.params;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (!group.members.includes(userId)) {
            return res.status(400).json({ message: 'User is not a member of this group' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user); // Return complete user profile
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
});


export { createGroup, sendGroupInvite, acceptGroupInvite, getGroupData, getGroupUser };