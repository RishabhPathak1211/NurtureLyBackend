const videoModel = require('../models/video');
const patientModel = require('../models/patient');
const ExpressError = require('../utils/ExpressError');

module.exports.fetchVideos = async (req, res, next) => {
    const { user } = req;
    if (!user) return next(new ExpressError('Authorization Failed', 403));
    try {
        const patient = await patientModel.findById(user.patient_id).populate('todayVideos');
        if (!patient.updateVideos) return res.status(200).json(patient.todayVideos);
        else {
            const newVideos = [];
            const types = ['Cognitive', 'Fine Motor', 'Sensory', 'Gross Motor', 'Speech']
            for (let val of types) {
                let level;
                switch (val) {
                    case 'Cognitive':
                        level = patient.currentLevel.cognitive;
                        break;
                    case 'Fine Motor':
                        level = patient.currentLevel.fineMotor;
                        break;
                    case 'Speech':
                        level = patient.currentLevel.speech;
                        break;
                    case 'Gross Motor':
                        level = patient.currentLevel.grossMotor;
                        break;
                    case 'Sensory':
                        level = patient.currentLevel.sensory;
                        break;
                }
                let count = await videoModel.countDocuments({ 
                    category: val,
                    difficulty: level,
                    _id: { $nin: patient.videosCompleted } 
                });
                let random = Math.floor(Math.random() * count);
                let video = await videoModel.findOne({ 
                    category: val,
                    difficulty: level,
                    _id: { $nin: patient.videosCompleted }
                }).skip(random);
                if (video) newVideos.push(video._id);
            }
            const newPatient = await patientModel.findByIdAndUpdate(
                user.patient_id, { todayVideos: newVideos, updateVideos: false }, { new: true }).populate('todayVideos');
            return res.status(201).json(newPatient.todayVideos);
        }
    } catch (err) {
        console.log(err);
        next(new ExpressError());
    }
}
