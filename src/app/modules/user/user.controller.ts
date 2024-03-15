import { RequestHandler } from "express";
import { userServices } from "./user.service";

const createAdmin: RequestHandler = async (req, res) => {
  const result = userServices.createAdmin();

  res.send(result);
};

export const userControllers = {
  createAdmin,
};
