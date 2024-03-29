import { adminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";

// get all admins
const getAllAdmins = catchAsync(async (req, res) => {
  const filters = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await adminServices.getAllAdmins(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Admins fetched successfully!",
    meta: result.meta,
    data: result.data,
  });
});

// get single admin
const getSingleAdmin = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await adminServices.getSingleAdmin(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin fetched successfully!",
    data: result,
  });
});

// update admin
const updateAdmin = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const result = await adminServices.updateAdmin(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Updated successfully!",
    data: result,
  });
});

// delete admin
const deleteAdmin = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await adminServices.deleteAdmin(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Deleted successfully!",
    data: result,
  });
});

// delete admin
const softDeleteAdmin = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await adminServices.softDeleteAdmin(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Deleted successfully!",
    data: result,
  });
});

export const adminControllers = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
