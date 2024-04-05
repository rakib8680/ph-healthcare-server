import { Prisma } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { doctorSearchableFields } from "./doctor.constants";
import { TDoctorFilterRequest } from "./doctor.interface";
import { TPaginationOptions } from "../../interfaces/pagination";

const getAllFromDB = async (
  filters: TDoctorFilterRequest,
  options: TPaginationOptions
) => {
  const { page, limit, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  // searching
  if (filters.searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: filters.searchTerm,
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

  const whereConditions: Prisma.DoctorWhereInput = { AND: andConditions };

  const result = await prisma.doctor.findMany({
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

  const total = await prisma.doctor.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};







export const DoctorService = {
    getAllFromDB,
}