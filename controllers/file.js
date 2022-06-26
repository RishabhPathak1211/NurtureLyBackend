const fileModel = require('../models/file');
const patientModel = require('../models/patient');
const ExpressError = require('../utils/ExpressError');
const { cloudinary } = require('../utils/Cloudinary');

module.exports.sendFile = async (req, res, next) => {
    const { user, file } = req;
    if (!user) return next(new ExpressError('Authorization failed', 403));
    if (!file) return next(new ExpressError('No file provided', 400));
    try {
        if (user.patient_id) {
            const patient = await patientModel.findById(user.patient_id);
            if (!patient.doctor) {
                await cloudinary.uploader.destroy(file.filename);
                return next(new ExpressError('Doctor not assigned', 401));
            }
            const newFile = new fileModel({
                link: file.path,
                filename: file.originalname,
                from: 'patient',
                patientID: patient._id,
                doctorID: patient.doctor
            });
            await newFile.save();
            return res.status(201).json(newFile);
        } else if (user.doctor_id) {
            const { patientID } = req.body;
            const newFile = new fileModel({
                link: file.path,
                filename: file.originalname,
                from: 'doctor',
                patientID: patientID,
                doctorID: user.doctor_id
            });
            await newFile.save();
            return res.status(201).json(newFile);
        }
        return next(new ExpressError());
    } catch (err) {
        console.log(err);
        return next(new ExpressError());
    }
}

module.exports.getFileList = async (req, res, next) => {
    const { patientID, doctorID } = req.body;
    if (!patientID || !doctorID) return next(new ExpressError('Missing Parameters', 401));
    try {
        const files = await fileModel.find({ patientID, doctorID }).sort({ date: -1 });
        return res.status(200).json(files);
    } catch (err) {
        console.log(err);
        return next(new ExpressError());
    }
}