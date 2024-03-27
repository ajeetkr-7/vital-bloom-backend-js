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