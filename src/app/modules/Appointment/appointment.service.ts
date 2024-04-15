import { JwtPayload } from "jsonwebtoken";
import prisma from "../../../shared/prisma";
import { v4 as uuidv4 } from "uuid";




const createAppointment = async (user: JwtPayload, payload: any) => {


  // get patient and doctor data from the database
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
    },
  });

  // get doctor schedule data from the database
  await prisma.doctorSchedules.findFirstOrThrow({
    where: {
      doctorId: doctorData.id,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });



  const videoCallingId = uuidv4();


  // create an appointment
  const result = await prisma.$transaction(async (tx) => {

  
    // add appointment data 
    const appointmentData = await tx.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: payload.scheduleId,
        videoCallingId,
      },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
      },
    });


    // update appointment status in doctor schedule
    await tx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: appointmentData.id,
      },
    });


     // PH-HealthCare-date-time
     const today = new Date();

    const transactionId = "PH-HealthCare-" + today.getFullYear() + "-" + today.getMonth() + "-" + today.getDay() + "-" + today.getHours() + ":" + today.getMinutes();

    console.log(transactionId);
    // add transaction data
    await tx.payment.create({
        data: {
            appointmentId: appointmentData.id,
            amount: doctorData.appointmentFee,
            transactionId
        }
    })


    return appointmentData;

  });


  return result;

};





export const AppointmentService = {
  createAppointment,
};
