


import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { DoctorScheduleService } from './doctorSchedule.service';


const insertIntoDB = catchAsync(async (req: Request & {user?:any}, res) => {
  const user = req.user;
  const result = await DoctorScheduleService.insertIntoDB(req.body, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor Schedule created successfully',
    data: result,
  });
});





export const ScheduleController = {
    insertIntoDB,
  };