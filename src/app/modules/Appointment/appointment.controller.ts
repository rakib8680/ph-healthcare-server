import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../shared/catchAsync";
import { Request } from "express";
import { AppointmentService } from "./appointment.service";



const createAppointment = catchAsync(async (req: Request & { user?: JwtPayload }, res) => {

    const user = req.user;

    const result = await AppointmentService.createAppointment(user as JwtPayload, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Appointment booked successfully!",
        data: result
    })
});





export const AppointmentController = {
    createAppointment,
}