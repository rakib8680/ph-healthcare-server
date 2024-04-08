

import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { ScheduleService } from "./schedules.service";
import pick from "../../../shared/pick";
import { scheduleFilterableFields } from "./schedule.constants";

const insertIntoDB = catchAsync(async (req, res) => {
    const result = await ScheduleService.insertIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Schedule created successfully!",
        data: result
    });
});



const getAllFromDB = catchAsync(async (req: Request & {user?:any}, res) => {
    const filters = pick(req.query, scheduleFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const user = req.user;
  const result = await ScheduleService.getAllFromDB(filters, options, user);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Schedule retrieval successfully',
        data: result
    });
  });
  


export const ScheduleController = {
    insertIntoDB,
    getAllFromDB
};