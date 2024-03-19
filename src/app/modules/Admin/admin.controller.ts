import { RequestHandler } from "express";
import { adminServices } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";

// get all admins
const getAllAdmins: RequestHandler = async (req, res) => {
  try {
    const filters = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await adminServices.getAllAdmins(filters, options);
    res.status(200).json({
      success: true,
      message: "All Admins fetched successfully!",
      meta: result.meta,
      data: result.data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server Error!",
      error: error.name,
    });
  }
};

// get single admin
const getSingleAdmin: RequestHandler = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await adminServices.getSingleAdmin(id);

    res.status(200).json({
      success: true,
      message: "Admin fetched successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server Error!",
      error: error.name,
    });
  }
};

export const adminControllers = {
  getAllAdmins,
  getSingleAdmin,
};
