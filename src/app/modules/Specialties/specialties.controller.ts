import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { SpecialtiesService } from "./specialties.service";
import catchAsync from "../../../shared/catchAsync";



// insert specialty into db
const insertIntoDB = catchAsync(async (req, res) => {
    console.log(req.body)
    const result = await SpecialtiesService.insertIntoDB(req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Specialties created successfully!",
        data: result
    });
});




export const SpecialtiesController = {
    insertIntoDB
};