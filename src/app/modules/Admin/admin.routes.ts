import express from "express";
import { adminControllers } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { adminValidations } from "./admin.validate";

const router = express.Router();

router.get("/", adminControllers.getAllAdmins);

router.get("/:id", adminControllers.getSingleAdmin);

router.patch(
  "/:id",
  validateRequest(adminValidations.updateAdminValidationSchema),
  adminControllers.updateAdmin
);

router.delete("/soft/:id", adminControllers.softDeleteAdmin);

router.delete("/:id", adminControllers.deleteAdmin);

export const adminRoutes = router;
