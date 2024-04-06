import { Doctor, Prisma, UserStatus } from "@prisma/client";
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
  const { searchTerm,specialties, ...filterData } = filters;



  const andConditions: Prisma.DoctorWhereInput[] = [];


  // doctor > doctorSpecialties > specialties -> title
  // filtering specialties
  if(specialties && specialties.length >0){
    andConditions.push({
      doctorSpecialties: {
        some:{  // some is used to check if any of the specialties matches the condition 
          specialties:{
            title:{
              contains:specialties,
              mode:"insensitive"
            }
          }
        }
      } 
    })
  }

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



const getByIdFromDB = async (id: string): Promise<Doctor | null> => {
  const result = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });
  return result;
};



const deleteFromDB = async (id: string): Promise<Doctor> => {
  return await prisma.$transaction(async (transactionClient) => {
    const deleteDoctor = await transactionClient.doctor.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: deleteDoctor.email,
      },
    });

    return deleteDoctor;
  });
};



const softDelete = async (id: string): Promise<Doctor> => {
  return await prisma.$transaction(async (transactionClient) => {
    const deleteDoctor = await transactionClient.doctor.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: deleteDoctor.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return deleteDoctor;
  });
};



const updateIntoDB = async (id: string, payload: any) => {

  const { specialties, ...doctorData } = payload;

  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });


  // transaction
  await prisma.$transaction(async (transactionClient) => {

    // update doctor data
    await transactionClient.doctor.update({
      where: {
        id,
      },
      data: doctorData,
      include: {
        doctorSpecialties: true,
      },
    });


    if (specialties && specialties.length > 0) {

      // delete specialties
      const deletedSpecialties = specialties.filter(
        (specialty: any) => specialty.isDeleted
      );
      for (const specialty of deletedSpecialties) {
        await transactionClient.doctorSpecialties.deleteMany({
          where: {
            doctorId: doctorInfo.id,
            specialtiesId: specialty.specialtiesId,
          },
        });
      }

      //create doctor specialties
      const createSpecialties = specialties.filter(
        (specialty: any) => !specialty.isDeleted
      );
      for (const specialty of createSpecialties) {
        await transactionClient.doctorSpecialties.create({
          data: {
            doctorId: doctorInfo.id,
            specialtiesId: specialty.specialtiesId,
          },
        });
      }
    }
  });


  // final fetch
  const result = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: doctorInfo.id,
    },
    include: {
      doctorSpecialties: true,
    },
  });

  return result;

};



export const DoctorService = {
  getAllFromDB,
  getByIdFromDB,
  deleteFromDB,
  softDelete,
  updateIntoDB,
};
