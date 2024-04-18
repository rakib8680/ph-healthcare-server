import { Request } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { PrescriptionService } from './prescription.service';
import pick from '../../../shared/pick';


// create a prescription 
const insertIntoDB = catchAsync(async (req: Request & { user?: JwtPayload }, res) => {
    const user = req.user;
    const result = await PrescriptionService.insertIntoDB(user as JwtPayload, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Prescription created successfully',
        data: result,
    });
});



// get patient prescription
const patientPrescription = catchAsync(async (req: Request & { user?: JwtPayload }, res) => {
    const user = req.user;
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
    const result = await PrescriptionService.patientPrescription(user as JwtPayload, options);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Prescription fetched successfully',
        meta: result.meta,
        data: result.data
    });
});





export const PrescriptionController = {
    insertIntoDB,
    patientPrescription
};