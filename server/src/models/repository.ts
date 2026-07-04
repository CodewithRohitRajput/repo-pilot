import mongoose from "mongoose"

const repoSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    githubRepoId: Number,
    name: String,
    fullName: String,
    owner: String
}, {
    timestamps: true
})


export default mongoose.model("Repo", repoSchema)