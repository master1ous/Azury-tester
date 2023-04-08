import { Schema, model } from 'mongoose';

export default model('premiumcode_schema', new Schema({
    code: { required: true, type: String },
    expires: { required: true, type: String },
}));