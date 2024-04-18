import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";





const insertIntoDB = async (user: JwtPayload, payload: any) => {

    // get patient data 
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user?.email
        }
    });

    // get patient data
    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId
        },
    });


    if (!(patientData.id === appointmentData.patientId)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "This is not your appointment!")
    };



    // use transaction to create review and update doctor average rating
    return await prisma.$transaction(async (tx) => {

        // create review
        const result = await tx.review.create({
            data: {
                appointmentId: appointmentData.id,
                doctorId: appointmentData.doctorId,
                patientId: appointmentData.patientId,
                rating: payload.rating,
                comment: payload.comment
            }
        });

        // get average rating 
        const averageRating = await tx.review.aggregate({
            _avg:{
                rating:true
            }
        });

        // update doctor average rating
        await tx.doctor.update({
            where: {
                id: result.doctorId
            },
            data: {
                averageRating :  averageRating._avg.rating as number
            }
        })

       return result;
    });



};









export const ReviewService = {
    insertIntoDB,
    // getAllFromDB
}