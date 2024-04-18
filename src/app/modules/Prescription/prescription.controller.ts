import { Request } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import { PrescriptionService } from './prescription.service';



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




export const PrescriptionController = {
    insertIntoDB,

};