
import { Schema, model } from "mongoose";

export default model("embedbuilder", new Schema({
    ownerID:  { required:true, type: String },
    embedID:  { required:true, type: String },
    embedData:  { required:true, type: Object },
    contentData:  { required:true, type: String },
}))