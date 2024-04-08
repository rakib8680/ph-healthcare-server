

import express from 'express';
import { ScheduleController } from './schedules.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();

router.post('/',
auth(UserRole.ADMIN,UserRole.SUPER_ADMIN),
 ScheduleController.insertIntoDB)


export const ScheduleRoutes = router;   