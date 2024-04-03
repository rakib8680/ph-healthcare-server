import { Prisma, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";
import { uploadToCloudinary } from "../../../helpers/fileUploader";
import { TFile } from "../../interfaces/file";
import { TPaginationOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { userSearchableFields } from "./user.constants";



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



// get all users from DB
const getAllUsers = async (params: any, options: TPaginationOptions) => {
  const { page, limit, skip } = calculatePagination(options);

  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.UserWhereInput[] = [];

  // searching
  if (params.searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // filtering
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((field) => ({
        [field]: {
          equals: (filterData as any)[field],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const total = await prisma.user.count({ where: whereConditions });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};


// update user status 
const changeProfileStatus = async (id: string, status: UserRole) => {
  const userData = await prisma.user.findUniqueOrThrow({
      where: {
          id
      }
  });

  const updateUserStatus = await prisma.user.update({
      where: {
          id
      },
      data: status
  });

  return updateUserStatus;
};



export const userServices = {
  createAdminIntoDB,
  createDoctorIntoDB,
  createPatientIntoDB,
  getAllUsers,
  changeProfileStatus
};
