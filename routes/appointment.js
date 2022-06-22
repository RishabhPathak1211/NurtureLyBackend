const express = require('express');
const auth = require('../middlewares/auth');
const appointmentControllers = require('../controllers/appointment')

const router = express.Router();

router.route('/book').post(auth, appointmentControllers.bookAppointment);
router.route('/patient/fetch').get(auth, appointmentControllers.fetchAppointment);
router.route('/doctor/fetch').get(auth, appointmentControllers.fetchAppointments);
router.route('/updateStatus').put(auth, appointmentControllers.changeAppointmentStatus);

module.exports = router;