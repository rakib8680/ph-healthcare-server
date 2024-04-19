import { PaymentStatus, UserRole } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../errors/ApiError";
import prisma from "../../../shared/prisma";

const fetchDashboardMetaData = async (user: JwtPayload) => {
  // check the user role and call the appropriate function
  switch (user.role) {
    case UserRole.SUPER_ADMIN:
      getSuperAdminMetaData();
      break;
    case UserRole.ADMIN:
      getAdminMetaData();
      break;
    case UserRole.DOCTOR:
      getDoctorMetaData(user);
      break;
    case UserRole.PATIENT:
      getPatientMetaData();
      break;
    default:
      throw new ApiError(
        400,
        "You are not authorized to access this resource!"
      );
  }
};



// super admin metadata
const getSuperAdminMetaData = async () => {};



// admin metadata
const getAdminMetaData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.count();

  const totalRevenue = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      status: PaymentStatus.PAID,
    },
  });

  return {
    appointmentCount,
    patientCount,
    doctorCount,
    paymentCount,
    totalRevenue,
  };
};


// doctor metadata
const getDoctorMetaData = async (user: JwtPayload) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const appointmentCount = await prisma.appointment.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const patientCount = await prisma.appointment.groupBy({
    by: ["patientId"],
    _count: {
      id: true,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      appointment: {
        doctorId: doctorData.id,
      },
      status: PaymentStatus.PAID,
    },
  });

  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { id: true },
    where: {
      doctorId: doctorData.id,
    },
  });


  const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ status, _count }) => ({
    status,
    count: Number(_count.id)
  }))

  console.log(formattedAppointmentStatusDistribution);


};




// patient metadata
const getPatientMetaData = async () => {
  console.log("Patient Meta Data");
};




export const MetaService = {
  fetchDashboardMetaData,
};
