import { Schema, model } from "mongoose";

export default model("imagine", new Schema({
    userID:   { required:true, type: String },
    usages:   { required:true, type: Number },
    resetAt:  { required:true, type: String }
}))