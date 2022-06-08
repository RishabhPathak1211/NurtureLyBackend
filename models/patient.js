const mongoose = require('mongoose');

const options = { type: Number, default: 3 };

const levelSchema = new mongoose.Schema({
    cognitive: options,
    fineMotor: options,
    grossMotor: options,
    speech: options,
    sensory: options,
})

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    dob: Date,
    phone: String,
    address: String,
    doctor: {
        type: mongoose.Types.ObjectId,
        ref: 'Doctor',
        default: null
    },
    currentLevel: {
        type: levelSchema,
        default: () => ({})
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