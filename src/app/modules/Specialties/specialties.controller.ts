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



// get all specialties
const getAllFromDB = catchAsync(async (req, res) => {
    const result = await SpecialtiesService.getAllFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Specialties data fetched successfully',
        data: result,
    });
});


// delete specialties from db
const deleteFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await SpecialtiesService.deleteFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Specialty deleted successfully',
        data: result,
    });
});




export const SpecialtiesController = {
    insertIntoDB,
    getAllFromDB,
    deleteFromDB
};