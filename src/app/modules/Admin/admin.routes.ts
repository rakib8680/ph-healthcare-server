import express from "express";
import { userControllers } from "../user/user.controller";
import { adminControllers } from "./admin.controller";

const router = express.Router();

router.get("/all-admins", adminControllers.getAllAdmins);

router.get("/:id", adminControllers.getSingleAdmin);

export const adminRoutes = router;
