import { RequestHandler } from "express";
import { adminServices } from "./admin.service";

// get all admins
const getAllAdmins: RequestHandler = async (req, res) => {

  try {
    const result = await adminServices.getAllAdmins(req.query);
    res.status(200).json({
      success: true,
      message: "All Admins fetched successfully!",
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
};
