import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../shared/catchAsync";
import { Request } from "express";
import { AppointmentService } from "./appointment.service";
import pick from "../../../shared/pick";


// create an appointment
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


// get my appointment
const getMyAppointment = catchAsync(async (req: Request & { user?: JwtPayload }, res) => {
    const user = req.user;
    const filters = pick(req.query, ['status', 'paymentStatus']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await AppointmentService.getMyAppointment(user as JwtPayload, filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'My Appointment retrieve successfully',
        data: result
    });
});




export const AppointmentController = {
    createAppointment,
    getMyAppointment
}