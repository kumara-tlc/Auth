const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
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
            type: Number
        },
        updated_by: {
            type: String,
            required: true,
        },
        updated_at: {
            type: Number
        }
    }
}, { versionKey: false });


const Project = mongoose.model('Project', projectSchema, 'Project')
module.exports = Project;
