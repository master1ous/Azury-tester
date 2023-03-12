import { Schema, model } from "mongoose";

export default model("warning", new Schema({
    guildID:  { required:true, type: String },
    userID:   { required:true, type: String },
    warnings: { required:true, type: Array }
}))