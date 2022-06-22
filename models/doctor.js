const mongoose = require('mongoose');

const patientAccSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Types.ObjectId,
        ref: 'Patient',
    },
    acceptedOn: Date
});

const patientPenShema = new mongoose.Schema({
    patient: { 
        type: mongoose.Types.ObjectId,
        ref: 'Patient'
    },
    pendingSince: Date
});

const doctorSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: String,
    mci: String,
    clinicAddress: String,
    patientsAcc: {
        type: [patientAccSchema],
        default: [],
    },
    patientsPen: {
        type: [patientPenShema],
        default: [],
    },
    patientsRej: {
        type: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Patient',
            }
        ],
        default: [],
    },
    token: String,
});

module.exports = mongoose.model('Doctor', doctorSchema);