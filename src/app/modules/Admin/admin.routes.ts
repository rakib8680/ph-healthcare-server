import express, { RequestHandler } from "express";
import { userControllers } from "../user/user.controller";
import { adminControllers } from "./admin.controller";

const router = express.Router();

const validateRequest: RequestHandler = (req, res, next) => {
  console.log("validated", req.body);
  next();
};

router.get("/all-admins", validateRequest, adminControllers.getAllAdmins);

router.get("/:id", adminControllers.getSingleAdmin);

router.patch("/:id", validateRequest, adminControllers.updateAdmin);

router.delete("/soft/:id", adminControllers.softDeleteAdmin);

router.delete("/:id", adminControllers.deleteAdmin);

export const adminRoutes = router;
