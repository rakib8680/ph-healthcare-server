


import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { DoctorScheduleService } from './doctorSchedule.service';
import pick from '../../../shared/pick';
import { scheduleFilterableFields } from '../Schedule/schedule.constants';


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




const getMySchedules = catchAsync(async (req: Request & {user?:any} , res) => {
  const filters = pick(req.query, scheduleFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const user = req.user;
  const result = await DoctorScheduleService.getMySchedules(filters, options, user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Doctor Schedule retrieval successfully',
    meta: result.meta,
    data: result.data,
  });
});



export const DoctorScheduleController = {
    insertIntoDB,
    getMySchedules
  };