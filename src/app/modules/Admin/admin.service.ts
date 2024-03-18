import { Prisma } from "@prisma/client";
import { adminSearchableFields } from "./admin.constant";
import { calculatePagination } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";

// get all admins from DB
const getAllAdmins = async (params: any, options: any) => {
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
          equals: filterData[field],
        },
      })),
    });
  }

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
  return result;
};

export const adminServices = {
  getAllAdmins,
};
