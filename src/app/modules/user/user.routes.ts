import express from "express";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/create-admin",
  auth("ADMIN", "SUPER_ADMIN"),
  userControllers.createAdmin
);

export const userRoutes = router;
