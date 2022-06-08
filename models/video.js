const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    link: String,
    thumbnail: String,
    description: String,
    title: String,
    difficulty: Number,
    monthMin: Number,
    monthMax: Number,
    category: {
        type: String,
        enum: ['Cognitive', 'Fine Motor', 'Sensory', 'Gross Motor', 'Speech']
    }
});

module.exports = mongoose.model('Video', videoSchema);