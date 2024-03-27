import express, { NextFunction, Request, Response } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { upload } from "../../../helpers/fileUploader";
import { userValidations } from "./user.validation";

const router = express.Router();


router.post(
  "/create-admin",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  upload.single("file"),
  (req:Request, res:Response, next:NextFunction)=>{

    req.body = userValidations.createAdminSchema.parse(JSON.parse(req.body.data))

   return userControllers.createAdmin(req, res, next)
  }
);







export const userRoutes = router;
