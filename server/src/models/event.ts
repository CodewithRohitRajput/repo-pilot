import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
    eventType: String,
    action: String,
    repository: String,
    issueTitle: String,
    sender: String,
    payload: Object,
    deliveryId: String
}, {timestamps: true})


export default mongoose.model("Event", eventSchema)