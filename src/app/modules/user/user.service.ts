import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { uploadToCloudinary } from "../../../helpers/fileUploader";
import { TFile } from "../../interfaces/file";



// create admin into DB
const createAdminIntoDB = async (req: any) => {
  // upload photo in cloudinary
  const file: TFile = req.file;
  if (file) {
    const uploadFile = await uploadToCloudinary(file);

    // set photo link in request body
    req.body.admin.profilePhoto = uploadFile?.secure_url;
  }

  // hash password
  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  // create user and admin
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

  return createdAdminData;
};



// create doctor into DB
const createDoctorIntoDB = async (req: any) => {
  // upload photo in cloudinary
  const file: TFile = req.file;
  if (file) {
    const uploadFile = await uploadToCloudinary(file);

    // set photo link in request body
    req.body.doctor.profilePhoto = uploadFile?.secure_url;
  }

  // hash password
  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  // create user and doctor
  const userData = {
    email: req.body.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };
  const createUser = prisma.user.create({
    data: userData,
  });
  const createDoctor = prisma.doctor.create({
    data: req.body.doctor,
  });

  // batch transaction
  const [createdUserData, createdDoctorData] = await prisma.$transaction([
    createUser,
    createDoctor,
  ]);

  return createdDoctorData;
};



// create patient into DB
const createPatientIntoDB = async (req: any) => {
  // upload photo in cloudinary
  const file: TFile = req.file;
  if (file) {
    const uploadFile = await uploadToCloudinary(file);
    console.log(uploadFile);

    // set photo link in request body
    req.body.patient.profilePhoto = uploadFile?.secure_url;
  }

  // hash password
  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  // create user and patient
  const userData = {
    email: req.body.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };
  const createUser = prisma.user.create({
    data: userData,
  });
  const createPatient = prisma.patient.create({
    data: req.body.patient,
  });

  // batch transaction
  const [createdUserData, createdPatientData] = await prisma.$transaction([
    createUser,
    createPatient,
  ]);

  return createdPatientData;
};



export const userServices = {
  createAdminIntoDB,
  createDoctorIntoDB,
  createPatientIntoDB,
};
