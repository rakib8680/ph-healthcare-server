import express from "express";
import { userControllers } from "../user/user.controller";
import { adminControllers } from "./admin.controller";


const router = express.Router();

router.get("/all-admins", adminControllers.getAllAdmins);



export const adminRoutes = router;