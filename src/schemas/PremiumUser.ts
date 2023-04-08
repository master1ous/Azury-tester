import { Schema, model } from 'mongoose';

export default model('premiumusers_schema', new Schema({
    userID: { required: true, type: String },
    expires: { required: true, type: String },
}));