import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { TCloudinaryResponse, TFile } from "../app/interfaces/file";

cloudinary.config({
  cloud_name: "dy6sgpkql",
  api_key: "357623463728155",
  api_secret: "kVHm3ajDRFO2f52xQmldafGKoh4",
});



// save file in local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});




// upload file in cloudinary
export const uploadToCloudinary = async (
  file: TFile
): Promise<TCloudinaryResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      `E:/Work FIles/PH-HEALTHCARE-SERVER/uploads/${file.originalname}`,

      (error, result: TCloudinaryResponse) => {
        // delete file from local storage
        fs.unlinkSync(
          `E:/Work FIles/PH-HEALTHCARE-SERVER/uploads/${file.originalname}`
        );

        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

export const upload = multer({ storage: storage });
