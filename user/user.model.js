import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import uniqueValidator from 'mongoose-unique-validator'
import privateValidator from 'mongoose-private'
import CONFIG from '../utils/config.js'
const userSchema = mongoose.Schema(
    {
        googleId: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        picture: {
            type: String,
            required: true,
        },
        level: {
            type: Number,
            default: 0,
        },
        age: {
            type: Number,
            default: 0,
        },
        // weight
        weight: {
            type: Number,
            default: 0,
        },
        height: {
            type: Number,
            default: 0,
        },
        groupInvites: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Group',
            },
        ],
        // sex - {Male, Female, Other}
        sex: {
            type: String,
            enum: ['Male', 'Female', 'Unspecified'],
            default: 'Unspecified',
        },

        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
            default: null,
        },

        healthInfo: {
            smoking: { type: Number, min: 0, max: 10, default: null },
            smokingStartAge: { type: Number, min: 0, default: null },
            drinking: { type: Boolean, default: false },
            workoutFrequency: { type: Number, min: 0, max: 100, default: null },
            stressLevel: { type: Number, min: 0, max: 10, default: null },
            jobDetails: {
                workStatus: { type: Boolean, default: false },
                workTime: { type: Number, min: 0, max: 16, default: null },
                satisfaction: { type: Number, min: -1, max: 1, default: null },
            },
            bodyDetails: {
                waistSize: { type: Number, default: null },
                bloodPressure: { type: Number, enum: [0, 1, 2], default: null },
                neckSize: { type: Number, default: null }, // Field name with a space for clarity
                hipSize: { type: Number, default: null },
            },
            constantlyTired: { type: Boolean, default: false },
            exerciseDuration: { type: Number, enum: [0, 1, 2, 3, 4], default: null },
            sleepAlarmingSign: { type: Boolean, default: false },
            snoring: { type: Boolean, default: false },
        },
    },
    {
        timestamps: true,
    }
);

// Duplicate the ID field.
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id; }
});

userSchema.methods.generateJWT = function () {
    return jwt.sign(
        {
            id: this._id,
            name: this.name,
            email: this.email,
        },
        CONFIG.JWT_SECRET,
        {
            expiresIn: CONFIG.JWT_EXPIRE,
        },
    )
}

const User = mongoose.model('User', userSchema);
export { User }