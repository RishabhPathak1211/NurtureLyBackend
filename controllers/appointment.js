const appointmentModel = require('../models/appointment');
const patientModel = require('../models/patient');
const doctorModel = require('../models/doctor');
const ExpressError = require('../utils/ExpressError');

module.exports.bookAppointment = async (req, res, next) => {
    const { user } = req;
    const { dateTime, description } = req.body;
    if (!user) return next(new ExpressError('Authorization Failed', 403));
    try {
        const patient = await patientModel.findById(user.patient_id);
        if (!patient.doctor) return next(new ExpressError('Doctor not assigned', 401));
        const appointment = await appointmentModel.create({ dateTime, description, patient: patient._id, doctor: patient.doctor });
        return res.status(200).json({ appointment });
    } catch (err) {
        console.log(err);
        return next(new ExpressError());
    }
}

module.exports.fetchAppointment = async (req, res, next) => {
    const { user } = req;
    if (!user) return next(new ExpressError('Authorization Failed', 403));
    try {
        const appointment = await appointmentModel.findOne({ patient: user.patient_id }).sort({ dateTime: -1 })
        if (appointment.dateTime > Date.now()) return res.status(200).json({ appointment });
        return res.status(400).json({ found: false });
    } catch (err) {
        console.log(err);
        return next(new ExpressError());
    }
}

module.exports.fetchAppointments = async (req, res, next) => {
    const { user } = req;
    const { type } = req.query;
    if (!user) return next(new ExpressError('Authorization Failed', 403));
    if (type !== 'pending' && type !== 'approved') return next(new ExpressError('Invalid Type', 401));
    try {
        const appointments = await appointmentModel.find({ doctor: user.doctor_id, status: type }).sort({ dateTime: -1 });
        return res.status(200).json({ appointments });
    } catch (err) {
        console.log(err);
        return next(new ExpressError());
    }
}

module.exports.changeAppointmentStatus = async (req, res, next) => {
    const { user } = req;
    const { appointmentId, status } = req.body;
    if (!user) return next(new ExpressError('Authorization Failed', 403));
    try {
        if (!appointmentId) return next(new ExpressError('Invalid Appointment ID', 401));
        if (!status && status !== 'approved' && status !== 'declined') return next(new ExpressError('Invalid Status Value', 401))
        await appointmentModel.findByIdAndUpdate(appointmentId, { status });
        return res.status(201).json({ success: true });
    } catch (err) {
        console.log(err);
        return next(new ExpressError());
    }
}