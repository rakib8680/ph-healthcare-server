import { Request } from "express";
import { uploadToCloudinary } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";
import { TFile } from "../../interfaces/file";
import { Specialties } from "@prisma/client";


// insert specialty into db
const insertIntoDB = async (req: Request) => {
  console.log(req.body);

  // upload file to cloudinary
  const file = req.file as TFile;
  if (file) {
    const uploadedFile = await uploadToCloudinary(file);
    req.body.icon = uploadedFile?.secure_url;
  }

  const result = await prisma.specialties.create({
    data: req.body,
  });

  return result;
};


// get all 
const getAllFromDB = async (): Promise<Specialties[]> => {
  return await prisma.specialties.findMany();
}


// delete from db
const deleteFromDB = async (id: string): Promise<Specialties> => {
  const result = await prisma.specialties.delete({
      where: {
          id,
      },
  });
  return result;
};




export const SpecialtiesService = {
  insertIntoDB,
  getAllFromDB,
  deleteFromDB
};
