import express from "express";
import { userControllers } from "./user.controller";

const router = express.Router();

router.post("/create-admin", userControllers.createAdmin);


export const userRoutes = router;
