const jwt = require('jsonwebtoken');
const patientModel = require('../models/patient');
const doctorModel = require('../models/doctor');
const ExpressError = require('../utils/ExpressError');

const token_key = process.env.TOKEN_KEY;

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
            const { phone, age, address } = req.body;
            patient = await patientModel.create({
                name,
                email,
                phone,
                age,
                address
            });
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