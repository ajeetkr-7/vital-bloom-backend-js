import mongoose from "mongoose";

const groupSchema = mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    invitedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
});

const Group = mongoose.model('Group', groupSchema);
export { Group };