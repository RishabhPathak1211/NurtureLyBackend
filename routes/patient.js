const express = require('express');
const patientController = require('../controllers/patient');
const auth = require('../middlewares/auth');

const router = express.Router();

router.route('/').get(auth, patientController.getPatientDetails);
router.route('/find').get(patientController.findUser);
router.route('/authenticate').post(patientController.authenticate);
router.route('/request/:doctorId').put(auth, patientController.postRequest);
router.route('/watchVideo/:videoId').put(auth, patientController.watchVideo);
// router.route('/getDoctorList').get(patientController.getDoctorList);

module.exports = router;