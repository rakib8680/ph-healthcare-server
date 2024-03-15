import express from "express";
import { userControllers } from "./user.controller";

const router = express.Router();

router.get("/", userControllers.createAdmin);

export const userRoutes = router;
