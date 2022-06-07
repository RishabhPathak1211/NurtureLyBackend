const express = require('express');
const doctorController = require('../controllers/doctor')
const auth = require('../middlewares/auth');

const router = express.Router();

router.route('/').get(auth, doctorController.getDoctorDetails);
router.route('/find').get(doctorController.findUser);
router.route('/list').get(doctorController.getDoctorList);
router.route('/patients').get(auth, doctorController.getPatientList);
router.route('/patients/:patientId').put(auth, doctorController.updatePatientList);
router.route('/authenticate').post(doctorController.authenticate);

module.exports = router;