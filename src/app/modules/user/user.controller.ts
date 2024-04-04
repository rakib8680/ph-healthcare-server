import { userServices } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import { userFilterableFields } from "./user.constants";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { Request, request } from "express";
import { JwtPayload } from "jsonwebtoken";




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


// update user status
const changeProfileStatus = catchAsync(async (req, res) => {

  const { id } = req.params;
  const result = await userServices.changeProfileStatus(id, req.body)

  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Users profile status changed!",
      data: result
  })
});



// get my profile
const getMyProfile = catchAsync(async (req: Request & { user?:JwtPayload }, res) => {

  const user = req.user;

  const result = await userServices.getMyProfile(user as JwtPayload);

  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My profile data fetched!",
      data: result
  })
});



// update my profile 
const updateMyProfile = catchAsync(async (req: Request & { user?: JwtPayload }, res) => {

  const user = req.user;

  const result = await userServices.updateMyProfile(user as JwtPayload, req);

  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My profile updated!",
      data: result
  })
});




export const userControllers = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllUsers,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile
};
