import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../shared/prisma";





const createAppointment = async (user: JwtPayload, payload: any) => {


    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user?.email
        }
    });


    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId
        }
    });


    console.log(payload);

}






export const AppointmentService = {
    createAppointment
}