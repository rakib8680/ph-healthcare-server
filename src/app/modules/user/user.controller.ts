import { RequestHandler } from "express";
import { userServices } from "./user.service";

// create admin
const createAdmin: RequestHandler = async (req, res) => {
  try {
    const result = await userServices.createAdminIntoDB(req.body);
    res.status(200).json({
      success: true,
      message: "Admin created successfully!",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.name || "Admin creation failed!",
      error: err,
    });
  }
};



export const userControllers = {
  createAdmin,
};
