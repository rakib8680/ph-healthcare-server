import { userServices } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import { userFilterableFields } from "./user.constants";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";




// create admin
const createAdmin = catchAsync(async (req, res) => {
  const result = await userServices.createAdminIntoDB(req);
  res.status(200).json({
    success: true,
    message: "Admin created successfully!",
    data: result,
  });
});



// create doctor
const createDoctor = catchAsync(async (req, res) => {
  const result = await userServices.createDoctorIntoDB(req);
  res.status(200).json({
    success: true,
    message: "Doctor created successfully!",
    data: result,
  });
});



// create patient 
const createPatient = catchAsync(async (req, res) => {
  const result = await userServices.createPatientIntoDB(req);
  res.status(200).json({
    success: true,
    message: "Patient created successfully!",
    data: result,
  });
});



// get all Users
const getAllUsers = catchAsync(async (req, res) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await userServices.getAllUsers(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Users fetched successfully!",
    meta: result.meta,
    data: result.data,
  });
});




export const userControllers = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUsers,
};
