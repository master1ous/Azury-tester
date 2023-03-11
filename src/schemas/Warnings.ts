import { Schema, model } from "mongoose";

export default model("warnings", new Schema({
    guildID:  { required:true, type: String },
    userID:   { required:true, type: String },
    warnings: { required:true, type: Array }
}))