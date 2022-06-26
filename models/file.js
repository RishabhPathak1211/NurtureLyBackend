const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    link: String,
    filename: String,
    date: {
        type: Date,
        default: Date.now()
    },
    from: {
        type: String,
        enum: ['doctor', 'patient'],
    },
    patientID: {
        type: mongoose.Types.ObjectId,
        ref: 'Patient'
    },
    doctorID: {
        type: mongoose.Types.ObjectId,
        ref: 'Doctor'
    }
});

module.exports = mongoose.model('File', fileSchema);