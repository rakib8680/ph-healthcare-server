import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import prisma from "../../../shared/prisma";


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



export const DoctorScheduleService = {
  insertIntoDB,
};
