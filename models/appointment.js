const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    dateTime: Date,
    description: String,
    patient: {
        type: mongoose.Types.ObjectId,
        ref: 'Patient'
    },
    doctor: {
        type: mongoose.Types.ObjectId,
        ref: 'Doctor',
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'declined'],
        default: 'pending'
    }
});

module.exports = mongoose.model('Appointment', appointmentSchema);