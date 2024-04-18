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
      getDoctorMetaData();
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

const getSuperAdminMetaData = async () => {
};



const getAdminMetaData = async () => {

    const appointmentCount = await prisma.appointment.count();
    const patientCount = await prisma.patient.count();
    const doctorCount = await prisma.doctor.count();
    const paymentCount = await prisma.payment.count();

    const totalRevenue = await prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
            status: PaymentStatus.PAID
        }
    });

    return {appointmentCount, patientCount, doctorCount, paymentCount, totalRevenue}

};





const getDoctorMetaData = async () => {
    console.log('Doctor Meta Data');
};

const getPatientMetaData = async () => {
    console.log('Patient Meta Data');
};

export const MetaService = {
  fetchDashboardMetaData,
};
