

import express from 'express';
import { ScheduleController } from './schedules.controller';

const router = express.Router();

router.post('/', ScheduleController.insertIntoDB)


export const ScheduleRoutes = router;