import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { uploadToCloudinary } from "../../../helpers/fileUploader";
import { TFile } from "../../interfaces/file";

// create admin into DB
const createAdminIntoDB = async (req: any) => {
  const file:TFile = req.file;
  if (file) {
    const uploadFile = await uploadToCloudinary(file);

    req.body.admin.profilePhoto = uploadFile?.secure_url;

  }

  // hash password
  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const createUser = prisma.user.create({
    data: userData,
  });
  const createAdmin = prisma.admin.create({
    data: req.body.admin,
  });

  // batch transaction
  const [createdUserData, createdAdminData] = await prisma.$transaction([
    createUser,
    createAdmin,
  ]);
  // console.log(createdAdminData);

  return createdAdminData;
};

export const userServices = {
  createAdminIntoDB,
};
