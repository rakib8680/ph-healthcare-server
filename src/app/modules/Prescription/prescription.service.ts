import { AppointmentStatus, PaymentStatus, Prescription } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { TPaginationOptions } from "../../interfaces/pagination";
import { calculatePagination } from "../../../helpers/paginationHelper";




// create a prescription 
const insertIntoDB = async (user: JwtPayload, payload: Partial<Prescription>) => {

    // Check if the appointment is completed and paid
    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId,
            status: AppointmentStatus.COMPLETED,
            paymentStatus: PaymentStatus.PAID
        },
        include: {
            doctor: true
        }
    });



    // Check if the appointment is created by the same doctor
    if(!(user?.email === appointmentData.doctor.email)){
        throw new ApiError(httpStatus.BAD_REQUEST, "You are not authorized to create prescription for this appointment")
    };



    // create prescription
    const result = await prisma.prescription.create({
        data:{
            appointmentId:appointmentData.id,
            doctorId: appointmentData.doctorId,
            patientId : appointmentData.patientId,
            instructions: payload.instructions as string,
            followUpDate: payload.followUpDate || null || undefined,
        },
        include:{
            patient:true
        }
    });



    return result;




};



// get patient prescription
const patientPrescription = async (user: JwtPayload, options: TPaginationOptions) => {

    const { limit, page, skip } = calculatePagination(options);

    const result = await prisma.prescription.findMany({
        where:{
            patient:{
                email: user.email
            }
        },
        skip,
        take:limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: 'desc' },
        include:{
            doctor:true,
            // patient:true,
            appointment:true
        }
    });


    const total = await prisma.prescription.count({
        where: {
            patient: {
                email: user?.email
            }
        }
    });


    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    };

}


export const PrescriptionService = {
    insertIntoDB,
    patientPrescription
}