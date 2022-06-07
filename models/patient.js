const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    age: Number,
    phone: String,
    address: String,
    doctor: {
        type: mongoose.Types.ObjectId,
        ref: 'Doctor',
        default: null
    },
    currentLevel: {
        type: Number,
        default: 5
    },
    updateVideos: {
        type: Boolean,
        default: true
    },
    todayVideos: {
        type: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Video',
            }
        ],
        default: []
    },
    videosCompleted: {
        type: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Video'
            }
        ],
        default: []
    },
    premium: {
        type: Boolean,
        default: false
    },
    token: String
});

module.exports = mongoose.model('Patient', patientSchema);