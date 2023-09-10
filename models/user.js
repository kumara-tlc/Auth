const mongoose = require('mongoose');
const { GetUnixTimestamp, GenerateUniqueId } = require('../core/common');

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        default: GenerateUniqueId()
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    additional_attributes: {
        is_deleted: {
            type: Boolean,
            default: false
        },
        created_at: {
            type: Number,
            default: GetUnixTimestamp()
        },
        updated_at: {
            type: Number,
            default: GetUnixTimestamp()
        }
    }
}, { versionKey: false });


const User = mongoose.model('User',userSchema,'User')
module.exports = User;