const jwt = require('jsonwebtoken');
const patientModel = require('../models/patient');
const doctorModel = require('../models/doctor');
const videoModel = require('../models/video');
const graphModel = require('../models/graph');
const ExpressError = require('../utils/ExpressError');

const token_key = process.env.TOKEN_KEY;

const updateGraph = async (videoID, patientID) => {
    const video = await videoModel.findById(videoID);
    const patient = await patientModel.findById(patientID).populate('videosCompleted');
    console.log(patient.videosCompleted)
    const graph = await graphModel.findOne({ patientID, category: video.category });
    console.log(graph)
    const ageGroup = `${video.monthMin}-${video.monthMax}`;
    console.log(ageGroup)
    const index = graph.xAxis.indexOf(ageGroup);
    console.log(index);
    const videos = await videoModel.find({ monthMin: video.monthMin, monthMax: video.monthMax, category: video.category });
    console.log(videos)
    let videosCompleted = 0;
    for (const watchedVideo of patient.videosCompleted) {
        if (video.category === watchedVideo.category && video.monthMin === watchedVideo.monthMin && video.monthMax === watchedVideo.monthMax)
            videosCompleted++;
    }
    console.log(videosCompleted)
    graph.yAxis[index] = (videosCompleted / videos.length) * 100;
    console.log(graph)
    await graph.save();
}

module.exports.findUser = async (req, res, next) => {
    const { name, email } = req.query;
    try {
        const patient = await patientModel.findOne({ name, email });
        if (patient) return res.status(200).json({ found: true });
        else return res.status(200).json({ found: false });
    } catch (err) {
        console.error(err);
        return next(new ExpressError());
    }
}

module.exports.authenticate = async (req, res, next) => {
    const { name, email } = req.body;
    try {
        let patient = await patientModel.findOne({ name, email });
        if (!patient) {
            const { phone, dob, address } = req.body;
            patient = await patientModel.create({
                name,
                email,
                phone,
                dob,
                address
            });
            for(const category of ['Cognitive', 'Fine Motor', 'Sensory', 'Gross Motor', 'Speech']) {
                await graphModel.create({ patientID: patient._id, category });
            }
        }

        const token = jwt.sign({
            patient_id: patient.id,
            email
        }, token_key);

        patient.token = token;

        return res.status(201).json(patient);
    } catch (err) {
        console.log(err);
        return next(new ExpressError());
    }
}

module.exports.getPatientDetails = async (req, res, next) => {
    const { user } = req;
    if (!user) return next(new ExpressError('Authorization Failed', 403));
    try {
        const patient = await patientModel.findById(user.patient_id).populate('doctor', '-patientsAcc -patientsPen -patientsRej');
        return res.status(200).json(patient);
    } catch (err) {
        console.log(err);
        return next(new ExpressError());
    }
}

module.exports.postRequest = async (req, res, next) => {
    const { doctorId } = req.params;
    const { user } = req
    if (!user) return next(new ExpressError('Authorization Failed', 403));
    try {
        await patientModel.findByIdAndUpdate(user.patient_id, {
            requested: true
        });

        await doctorModel.findByIdAndUpdate(doctorId, {
            $push: { patientsPen: { patient: user.patient_id, pendingSince: Date.now() } }
        });

        return res.status(201).json({ success: true });
    } catch (err) {
        console.log(err);
        return next(new ExpressError());
    }
}

module.exports.watchVideo = async (req, res, next) => {
    const { user } = req;
    const { videoId } = req.params
    if (!user) return next(new ExpressError('Authorization Failed', 403));
    try {
        await patientModel.findByIdAndUpdate(user.patient_id, {
            $push: {
                videosCompleted: videoId
            }
        });
        await updateGraph(videoId, user.patient_id);
        return res.status(201).json({ success: true });
    } catch (err) {
        console.log(err);
        next(new ExpressError());
    }
}

module.exports.updateLevel = async (req, res, next) => {
    const { user } = req;
    const { category } = req.params;
    const { method } = req.query;
    if (!user) return next(new ExpressError('Authorization Failed', 403));
    try {
        const level = `currentLevel.${category}`;
        let flag;
        const patient = await patientModel.findById(user.patient_id);
        if ((patient.currentLevel[category] === 5 && method === 'increase') 
            || (patient.currentLevel[category] === 1 && method === 'decrease'))
                return res.status(201).json({ success: true });
        if (method === 'increase') flag = 1;
        else if (method === 'decrease') flag = -1;
        const update = { $inc: { [level]: flag } };
        await patientModel.findByIdAndUpdate(user.patient_id, update);
        return res.status(201).json({ success: true });
    } catch (err) {
        console.error(err);
        next(new ExpressError());
    }
}