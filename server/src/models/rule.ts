import mongoose from 'mongoose'

const ruleSchema = new mongoose.Schema({
    keyword: String,
    label: String,
    slackEnabled : {
        type: Boolean,
        default: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

export default mongoose.model("Rule", ruleSchema)