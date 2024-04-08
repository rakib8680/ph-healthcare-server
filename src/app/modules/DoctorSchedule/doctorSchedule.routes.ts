


import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { ScheduleController } from './doctorSchedule.controller';

const router = express.Router();




router.post(
    '/',
    auth(UserRole.DOCTOR),
    ScheduleController.insertIntoDB,
  );



export const DoctorScheduleRoutes = router;