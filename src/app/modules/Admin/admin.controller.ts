import { RequestHandler } from "express";
import { adminServices } from "./admin.service";

// get all admins
const getAllAdmins: RequestHandler = async (req, res) => {
  const result = await adminServices.getAllAdmins();
  res.status(200).json({
    success: true,
    message: "All Admins fetched successfully!",
    data: result,
  });
};

export const adminControllers = {
  getAllAdmins,
};
