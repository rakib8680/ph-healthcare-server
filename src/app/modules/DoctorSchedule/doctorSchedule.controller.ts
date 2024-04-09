


import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import { DoctorScheduleService } from './doctorSchedule.service';
import pick from '../../../shared/pick';
import { scheduleFilterableFields } from '../Schedule/schedule.constants';
import { JwtPayload } from 'jsonwebtoken';


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




const deleteFromDB = catchAsync(async (req: Request & { user?:JwtPayload }, res: Response) => {

  const user = req.user;
  const { id } = req.params;
  const result = await DoctorScheduleService.deleteFromDB(user as JwtPayload, id);

  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My Schedule deleted successfully!",
      data: result
  });
});




const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, scheduleFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await DoctorScheduleService.getAllFromDB(filters, options);
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
    getMySchedules,
    deleteFromDB,
    getAllFromDB
  };