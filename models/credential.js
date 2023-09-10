const mongoose = require('mongoose');
const { GetUnixTimestamp, GenerateUniqueId } = require('../core/common');

const credentialSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        default: GenerateUniqueId()
    },
    userId: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    hint: {
        type: String,
        required: true,
        trim: true,
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


const Credential = mongoose.model('Credential',credentialSchema,'Credential')
module.exports = Credential;