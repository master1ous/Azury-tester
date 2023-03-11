import { Schema, model } from "mongoose";

export default model("giveaway", new Schema({
    guildID: { required:true, type: String },
    hostID:  { required:true, type: String },
    ends:   { required:true, type: Number },
    channelID: { required:true, type: String },
    giveawayID: { required:true, type: String },
    participants: { required:false, type: Array, default: [] },
    winnerCount: { required:false, type: Number },
    prize: { required:false, type: String },
    ended: { required:false, type: Boolean },
}))