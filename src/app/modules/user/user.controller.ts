import { RequestHandler } from "express";
import { userServices } from "./user.service";

const createAdmin: RequestHandler = async (req, res) => {

  const result =await userServices.createAdminIntoDB(req.body);

  res.send(result);
};

export const userControllers = {
  createAdmin,
};
