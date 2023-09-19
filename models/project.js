const mongoose = require('mongoose');
const { GetUnixTimestamp, GenerateUniqueId } = require('../core/common');

const projectSchema = new mongoose.Schema({
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
    description: {
        type: String,
        trim: true
    },
    sort_order: {
        type: Number,
        required: true,
        default: 0
    },
    additional_attributes: {
        is_deleted: {
            type: Boolean,
            default: false
        },
        created_by: {
            type: String,
            required: true,
        },
        created_at: {
            type: Number,
            default: GetUnixTimestamp()
        },
        updated_by: {
            type: String,
            required: true,
        },
        updated_at: {
            type: Number,
            default: GetUnixTimestamp()
        }
    }
}, { versionKey: false });


const Project = mongoose.model('Project', projectSchema, 'Project')
module.exports = Project;