import { RequestHandler, Response } from "express";
import { adminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

// get all admins
const getAllAdmins: RequestHandler = async (req, res, next) => {
  try {
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
  } catch (error: any) {
    next(error);
  }
};

// get single admin
const getSingleAdmin: RequestHandler = async (req, res, next) => {
  const id = req.params.id;

  try {
    const result = await adminServices.getSingleAdmin(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Admin fetched successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// update admin
const updateAdmin: RequestHandler = async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  try {
    const result = await adminServices.updateAdmin(id, data);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Updated successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// delete admin
const deleteAdmin: RequestHandler = async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await adminServices.deleteAdmin(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Deleted successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// delete admin
const softDeleteAdmin: RequestHandler = async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await adminServices.softDeleteAdmin(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Deleted successfully!",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const adminControllers = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
