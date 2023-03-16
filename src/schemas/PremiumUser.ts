import { Schema, model } from 'mongoose';

export default model('premium', new Schema({
    userID: { required: true, type: String },
    status: { required: true, type: Boolean },
}));