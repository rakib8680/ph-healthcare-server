import express from 'express'
import { DoctorController } from './doctor.controller';
import { UserRole } from '@prisma/client';
import auth from '../../middlewares/auth';


const router = express.Router();




router.get('/', DoctorController.getAllFromDB);

router.get('/:id', DoctorController.getByIdFromDB);


router.delete(
    '/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    DoctorController.deleteFromDB
);

router.delete(
    '/soft/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    DoctorController.softDelete);



export const DoctorRoutes = router;