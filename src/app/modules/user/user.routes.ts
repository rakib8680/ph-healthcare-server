import express from "express";
import { userControllers } from "./user.controller";

const router = express.Router();

router.post("/create-admin", userControllers.createAdmin);
router.get("/all-admins", userControllers.getAllAdmins);

export const userRoutes = router;
