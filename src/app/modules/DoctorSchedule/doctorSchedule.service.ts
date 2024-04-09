import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { calculatePagination } from "../../../helpers/paginationHelper";
import { TDoctorScheduleFilterRequest } from "./doctorSchedule.interface";
import { TPaginationOptions } from "../../interfaces/pagination";
import { IScheduleFilterRequest } from "../Schedule/schedule.interface";
import { Prisma } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";



const insertIntoDB = async (data: { scheduleIds: string[] }, user: any) => {
  const { scheduleIds } = data;

  const isDoctorExists = await prisma.doctor.findFirst({
    where: {
      email: user.email,
    },
  });
  if (!isDoctorExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Doctor does not exists!");
  }

  const doctorSchedulesData = scheduleIds.map((scheduleId) => ({
    doctorId: isDoctorExists.id,
    scheduleId,
  }));

  const result = await prisma.doctorSchedules.createMany({
    data: doctorSchedulesData,
  });

  return result;
};



const getMySchedules = async (
  filters: any,
  options: TPaginationOptions,
  user: JwtPayload
) => {
  const { limit, page, skip } = calculatePagination(options);
  const { startDate, endDate, ...filterData } = filters;
  //console.log(filterData)

  const andConditions = [];

  if (startDate && endDate) {
    andConditions.push({
      AND: [
        {
          schedule: {
            startDate: {
              gte: startDate,
            },
          },
        },
        {
          schedule: {
            endDate: {
              lte: endDate,
            },
          },
        },
      ],
    });
  }

  if (Object.keys(filterData).length > 0) {
    if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "true"
    ) {
      filterData.isBooked = true;
    } else if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "false"
    ) {
      filterData.isBooked = false;
    }

    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }

  const whereConditions: Prisma.DoctorSchedulesWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctorSchedules.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {},
  });
  const total = await prisma.doctorSchedules.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};



export const DoctorScheduleService = {
  insertIntoDB,
  getMySchedules,
};
