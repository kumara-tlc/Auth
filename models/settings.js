const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    font_family: {
        type: String,
        trim: true,
        default: "roboto"
    },
    font_size: {
        type: Number,
        default: 14
    },
    color: {
        type: String,
        trim: true,
        default: "f6f6f6"
    },
    additional_attributes: {
        is_deleted: {
            type: Boolean,
            default: false
        },
        created_at: {
            type: Number
        },
        updated_at: {
            type: Number
        }
    }
}, { versionKey: false });


const Settings = mongoose.model('Settings',settingsSchema,'Settings')
module.exports = Settings;
