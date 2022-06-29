const mongoose = require('mongoose');

const graphSchema = new mongoose.Schema({
    xAxis: {
        type: [String],
        default: ['0-3', '4-6', '7-9', '10-12', '13-15', '16-18', '19-21', '22-24', '25-27', '28-30', '31-33', '34-36']
    },
    yAxis: {
        type: [Number],
        default: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    category: {
        type: String,
        enum: ['Cognitive', 'Fine Motor', 'Sensory', 'Gross Motor', 'Speech']
    },
    patientID: {
        type: mongoose.Types.ObjectId,
        ref: 'Patient',
        default: null
    }
});

module.exports = mongoose.model('Graph', graphSchema);