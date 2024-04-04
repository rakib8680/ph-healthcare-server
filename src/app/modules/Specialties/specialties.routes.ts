import express, { NextFunction, Request, Response } from "express";
import { upload } from "../../../helpers/fileUploader";
import { SpecialtiesController } from "./specialties.controller";
import { SpecialtiesValidations } from "./specialties.validation";

const router = express.Router();


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


export const SpecialtiesRoutes = router;
