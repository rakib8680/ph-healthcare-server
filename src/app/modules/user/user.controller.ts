import { RequestHandler } from "express";
import { userServices } from "./user.service";

// create admin
const createAdmin: RequestHandler = async (req, res) => {
  const result = await userServices.createAdminIntoDB(req.body);

  res.send(result);
};

// get all admins
const getAllAdmins: RequestHandler = async (req, res) => {
  const result = await userServices.getAllAdmins();
  res.send({
    data: result,
  });
};

export const userControllers = {
  createAdmin,
  getAllAdmins,
};
