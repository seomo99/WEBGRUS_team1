const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const { model } = mongoose;

const UsernameSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
});

const FollowerSchema = new Schema({
    followercnt: { type: Number, min: 0, default: 0 },
    followerid: [String],
});

const FollowingSchema = new Schema({
    followingcnt: { type: Number, min: 0, default: 0 },
    followingid: [String],
});

const UserSchema = new Schema({
    username: UsernameSchema,
    userid: { type: String, index: true, unique: true, required: true },
    useremail: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    follower: FollowerSchema,
    following: FollowingSchema,
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (err) {
        return next(err);
    }
})

module.exports = model('User', UserSchema);