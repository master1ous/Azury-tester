import { Schema, model } from "mongoose";

export default model("afk", new Schema({
    guildID: { required:true, type: String },
    userID:  { required:true, type: String },
    reason:  { required:true, type: String },
    created: { required:true, type: String },
}))