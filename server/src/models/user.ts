import mongoose from "mongoose"

const userSchema = new mongoose.Schema({

    githubId: String,
    username: String,
    name: String,
    email: String,
    avatar: String,
    accessToken: String

}, {timestamps: true})

export default mongoose.model('User', userSchema)