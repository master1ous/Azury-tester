import { Schema, model } from "mongoose";

export default model("reminder", new Schema({
    userID:  { required:true, type: String },
    reminderID:  { required:true, type: String },
    date:  { required:true, type: String },
    time:   { required:true, type: String },
    reminder: { required:true, type: String },
    createdAt: { required:true, type: String },
    channel: { required:true, type: String },
    loop: { required:true, type: Boolean },
    parseDate: { required:false, type: String },
}))