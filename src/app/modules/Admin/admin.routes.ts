import express from "express";
import { userControllers } from "../user/user.controller";
import { adminControllers } from "./admin.controller";

const router = express.Router();

router.get("/all-admins", adminControllers.getAllAdmins);

router.get("/:id", adminControllers.getSingleAdmin);

router.patch("/:id", adminControllers.updateAdmin);

router.delete("/:id", adminControllers.deleteAdmin);

export const adminRoutes = router;
