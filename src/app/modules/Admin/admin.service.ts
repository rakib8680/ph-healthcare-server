import { Admin, Prisma, UserStatus } from "@prisma/client";
import { adminSearchableFields } from "./admin.constant";
import { calculatePagination } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { TAdminFilterRequest } from "./admin.interface";
import { TPaginationOptions } from "../../interfaces/pagination";

// get all admins from DB
const getAllAdmins = async (
  params: TAdminFilterRequest,
  options: TPaginationOptions
) => {
  const { page, limit, skip } = calculatePagination(options);

  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.AdminWhereInput[] = [];

  // searching
  if (params.searchTerm) {
    andConditions.push({
      OR: adminSearchableFields.map((field) => ({
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

  // add a condition to filter out the soft deleted records
  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };

  const result = await prisma.admin.findMany({
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
  });

  const total = await prisma.admin.count({ where: whereConditions });
  
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// get single admin by id
const getSingleAdmin = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  return result;
};

// update admin data
const updateAdmin = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin> => {
  
  // check if the user exists
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.admin.update({
    where: {
      id,
    },
    data,
  });

  return result;
};

// delete admin
const deleteAdmin = async (id: string): Promise<Admin | null> => {
  // Fetch the admin's email first
  const admin = await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const deleteFromAdminTable = prisma.admin.delete({
    where: {
      id,
    },
  });

  const deleteFromUserTable = prisma.user.delete({
    where: {
      email: admin.email,
    },
  });

  const [deleteAdmin, deleteUser] = await prisma.$transaction([
    deleteFromAdminTable,
    deleteFromUserTable,
  ]);

  return deleteAdmin;
};

// soft delete
const softDeleteAdmin = async (id: string): Promise<Admin | null> => {
  // Fetch the admin's email first
  const admin = await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const deleteFromAdminTable = prisma.admin.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
    },
  });

  const deleteFromUserTable = prisma.user.update({
    where: {
      email: admin.email,
    },
    data: {
      status: UserStatus.DELETED,
    },
  });

  const [deleteAdmin, deleteUser] = await prisma.$transaction([
    deleteFromAdminTable,
    deleteFromUserTable,
  ]);

  return deleteAdmin;
};

export const adminServices = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
  softDeleteAdmin,
};
