const jwt = require('jsonwebtoken');
const doctorModel = require('../models/doctor');
const patientModel = require('../models/patient');
const ExpressError = require('../utils/ExpressError');

module.exports.findUser = async (req, res, next) => {
    const { username, email } = req.query;
    try {
        console.log(username + email);
        const doctor = await doctorModel.findOne({ username, email });
        console.log(doctor);
        if (doctor) return res.status(200).json({ found: true });
        else return res.status(200).json({ found: false });
    } catch (err) {
        console.error(err);
        return next(new ExpressError());
    }
}

module.exports.authenticate = async (req, res, next) => {
    const { username, email } = req.body;
    const token_key = process.env.TOKEN_KEY
    try {
        let doctor = await doctorModel.findOne({ username, email });
        if (!doctor) {
            const { mci, phone, clinicAddress } = req.body;
            doctor = await doctorModel.create({
                username,
                email,
                mci,
                phone,
                clinicAddress
            });
        }

        const token = jwt.sign({
            doctor_id: doctor._id,
            email,
        }, token_key);

        doctor.token = token;

        return res.status(201).json(doctor);
    } catch (err) {
        console.log(err);
        return next(new ExpressError());
    }
}

module.exports.getDoctorDetails = async (req, res, next) => {
    const { user } = req;
    if (!user) return next(new ExpressError('Authorization Failed', 403));
    try {
        const doctor = await doctorModel.findById(user.doctor_id, '-patientsAcc -patientsPen -patientsRej');
        return res.status(200).json(doctor);
    } catch (err) {
        console.log(err);
        return next(new ExpressError());
    }
}

module.exports.getPatientList = async (req, res, next) => {
    const { user } = req;
    const { type } = req.query;
    if (!user) return next(new ExpressError('Authorization Failed', 403));
    try {
        if (type === 'accepted') {
            const doctor = await doctorModel.findById(user.doctor_id, 'patientsAcc').populate('patientsAcc.patient');
            return res.status(200).json(doctor);
        } else if (type === 'pending') {
            const doctor = await doctorModel.findById(user.doctor_id, 'patientsPen').populate('patientsPen.patient');
            return res.status(200).json(doctor);
        } else {
            return next(new ExpressError('Invalid query', 404));
        }
    } catch (err) {
        console.log(err);
        return next(new ExpressError());
    }
}

module.exports.updatePatientList = async (req, res, next) => {
    const { user } = req;
    const { method } = req.query;
    const { patientId } = req.params;
    if (!user) return next(new ExpressError('Authorization Failed', 403));
    try {
        if (method === 'accept') {
            await doctorModel.findByIdAndUpdate(user.doctor_id, {
                $pull: { patientsPen: { patient: patientId } },
                $push: { patientsAcc: { patient: patientId, acceptedOn: Date.now() } }
            });

            await patientModel.findByIdAndUpdate(patientId, {
                doctor: user.doctor_id
            })
        } else if (method === 'reject') {
            await doctorModel.findByIdAndUpdate(user.doctor_id, {
                $pull: { patientsPen: { patient: patientId } },
                $push: { patientsRej: { patient: patientId } }
            });

            await patientModel.findByIdAndUpdate(patientId, {
                requested: false
            })
        } else return next(new ExpressError('Invalid query', 404));
        return res.status(201).json({ msg: 'Success' });
    } catch (err) {
        console.log(err);
        return next(new ExpressError());
    }
}

module.exports.getDoctorList = async (req, res, next) => {
    try {
        const doctors = await doctorModel.find({});
        return res.status(200).json(doctors);
    } catch (err) {
        console.log(err);
        return next(new ExpressError());
    }
}