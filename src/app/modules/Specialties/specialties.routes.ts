import express, { NextFunction, Request, Response } from "express";
import { upload } from "../../../helpers/fileUploader";
import { SpecialtiesController } from "./specialties.controller";
import { SpecialtiesValidations } from "./specialties.validation";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = express.Router();


router.get(
  '/',
  SpecialtiesController.getAllFromDB
);


router.post(
  "/",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = SpecialtiesValidations.createSpecialtySchema.parse(
      JSON.parse(req.body.data)
    );
    return SpecialtiesController.insertIntoDB(req, res, next);
  }
);



router.delete(
  '/:id',
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  SpecialtiesController.deleteFromDB
);

export const SpecialtiesRoutes = router;
