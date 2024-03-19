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

// update admin
const updateAdmin: RequestHandler = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  try {
    const result = await adminServices.updateAdmin(id, data);

    res.status(200).json({
      success: true,
      message: "User Updated successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.name || "update failed!",
      error: error,
    });
  }
};


// delete admin 
const deleteAdmin: RequestHandler = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await adminServices.deleteAdmin(id);

    res.status(200).json({
      success: true,
      message: "User Deleted successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.name || "delete failed!",
      error: error,
    });
  }
}
// delete admin 
const softDeleteAdmin: RequestHandler = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await adminServices.softDeleteAdmin(id);

    res.status(200).json({
      success: true,
      message: "User Deleted successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.name || "delete failed!",
      error: error,
    });
  }
}



export const adminControllers = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin
};
