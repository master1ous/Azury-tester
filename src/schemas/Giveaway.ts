import { Schema, model } from "mongoose";

export default model("giveaways", new Schema({
    guildID: { required:true, type: String },
    guild: { required: false, type: String },
    ends:   { required:true, type: Number },
    channelID: { required:true, type: String },
    giveawayID: { required:true, type: String },
    participants: { required:false, type: Array, default: [] },
    winnerCount: { required:false, type: Number },
    prize: { required:false, type: String },
    ended: { required:false, type: Boolean },
}))