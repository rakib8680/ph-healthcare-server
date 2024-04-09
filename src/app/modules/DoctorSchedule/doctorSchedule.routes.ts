


import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { DoctorScheduleController } from './doctorSchedule.controller';

const router = express.Router();



router.get(
  '/',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  DoctorScheduleController.getAllFromDB
);


router.post(
    '/',
    auth(UserRole.DOCTOR),
    DoctorScheduleController.insertIntoDB,
  );



  
  router.get(
    '/my-schedules',
    auth(UserRole.DOCTOR),
    DoctorScheduleController.getMySchedules
  );
  



  
router.delete(
  '/:id',
  auth(UserRole.DOCTOR),
  DoctorScheduleController.deleteFromDB
);



export const DoctorScheduleRoutes = router;