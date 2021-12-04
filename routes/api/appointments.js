const express = require('express');
const router = express.Router();
const passport = require('passport');
const appointmentsApi = require('../../controllers/api/appointments_api');

router.post('/create', passport.authenticate('jwt', {session: false}), appointmentsApi.createAppointment);
router.post('/update', passport.authenticate('jwt', {session: false}), appointmentsApi.updateAppointment);
router.post('/delete', passport.authenticate('jwt', {session: false}), appointmentsApi.deleteAppointment);
router.get('/:id', passport.authenticate('jwt', {session: false}), appointmentsApi.details);
router.get('/requestedAppointments/doctor=:id', passport.authenticate('jwt', {session: false}), appointmentsApi.requestedAppointments);
module.exports = router;