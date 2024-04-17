import { PaymentStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { SSLServices, TInitPaymentData } from "../SSL/ssl.service";




const initPayment = async (appointmentId: string) => {
  // get payment information from database
  const paymentData = await prisma.payment.findFirstOrThrow({
    where: {
      appointmentId,
    },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });

  // prepare payment data
  const initPaymentData: TInitPaymentData = {
    amount: paymentData.amount,
    transactionId: paymentData.transactionId,
    name: paymentData.appointment.patient.name,
    email: paymentData.appointment.patient.email,
    address: paymentData.appointment.patient.address,
    contactNumber: paymentData.appointment.patient.contactNumber,
  };

  // initiate payment
  const paymentResponse = await SSLServices.initPayment(initPaymentData);

  return {
    paymentURL: paymentResponse.GatewayPageURL,
  };
};





const validatePayment = async (payload: any) => {

  // if (!payload || !payload.status || !(payload.status === "VALID")) {
  //   return {
  //     message: "Invalid Payment!",
  //   };
  // }


  // const response = await SSLServices.validatePayment(payload);

  // if (response?.status !== "VALID") {
  //   return {
  //     message: "Payment Failed!",
  //   };
  // }


  const response = payload;


  // use transaction to update in payment table and appointment table
  await prisma.$transaction(async (tx) => {
    const updatedPaymentData = await tx.payment.update({
      where: {
        transactionId: response.tran_id,
      },
      data: {
        status: PaymentStatus.PAID,
        paymentGatewayData: response,
      },
    });


    await tx.appointment.update({
      where: {
          id: updatedPaymentData.appointmentId
      },
      data: {
          paymentStatus: PaymentStatus.PAID
      }
  })
  });

  return {
    message: "Payment success!"
}

};




export const PaymentServices = {
  initPayment,
  validatePayment,
};
