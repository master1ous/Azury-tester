import { Schema, model } from "mongoose";
import { createTrue } from "typescript";

export default model("settings", new Schema({
    guildID: { required:true, type: String },
    language: { required: false, type: String },
    
    chatgptthreads: { required: false, type: Boolean, default: true },
    chatgpt: { required: false, type: String, default: null },
    antighostmessage: { required: false, type: Boolean, default: false },
    welcome: { required: false, type: Array, default: [] },
    leave: { required: false, type: Array, default: [] },
    audit: { required: false, type: Array, default: [] },
    anti_spam: { required: false, type: Array, default: [] },
    anti_mass_mention: { required: false, type: Array, default: [] },
    anti_alt: { required: false, type: Array, default: [] },
    bad_words: { required: false, type: Array, default: [] },
    responders: { required: false, type: Array, default: [] },
    sticky_messages: { required: false, type: Array, default: [] },
    sticky_roles: { required: false, type: Array, default: [] },
}))