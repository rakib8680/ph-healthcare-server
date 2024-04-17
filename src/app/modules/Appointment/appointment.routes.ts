
import express from 'express'
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { AppointmentController } from './appointment.controller';

const router = express.Router();


router.get(
    '/',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    AppointmentController.getAllFromDB
);



router.get(
    '/my-appointments',
    auth(UserRole.PATIENT, UserRole.DOCTOR),
    AppointmentController.getMyAppointment
)





router.post(
    '/',
    auth(UserRole.PATIENT),
    AppointmentController.createAppointment
);



export const AppointmentRoutes = router;