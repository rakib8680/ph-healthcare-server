import axios from "axios";
import config from "../../../config";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

export type TInitPaymentData = {
  amount: number;
  transactionId: string;
  name: string;
  email: string;
  address: string | null;
  contactNumber: string;
};

const initPayment = async (paymentData: TInitPaymentData) => {
  try {
    const data = {
      store_id: config.sslStoreId,
      store_passwd: config.sslStorePassword,
      total_amount: paymentData?.amount,
      currency: "BDT",
      tran_id: paymentData.transactionId, // use unique tran_id for each api call
      success_url: config.sslSuccessUrl,
      fail_url: config.sslFailUrl,
      cancel_url: config.sslCancelUrl,
      ipn_url: "http://localhost:3030/ipn",
      shipping_method: "N/A",
      product_name: "Appointment.",
      product_category: "Service",
      product_profile: "general",
      cus_name: paymentData.name,
      cus_email: paymentData.email,
      cus_add1: paymentData.address,
      cus_add2: "N/A",
      cus_city: "N/A",
      cus_state: "N/A",
      cus_postcode: "N/A",
      cus_country: "Bangladesh",
      cus_phone: paymentData.contactNumber,
      cus_fax: "N/A",
      ship_name: "N/A",
      ship_add1: "N/A",
      ship_add2: "N/A",
      ship_city: "N/A",
      ship_state: "N/A",
      ship_postcode: 1000,
      ship_country: "N/A",
    };

    const response = await axios({
      method: "POST",
      url: config.sslPaymentApi,
      data: data,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return response.data;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Payment initiation failed");
  }
};




const validatePayment = async (payload: any) => {
  try {
      const response = await axios({
          method: 'GET',
          url: `${config.sslValidationApi}?val_id=${payload.val_id}&store_id=${config.sslStoreId}&store_passwd=${config.sslStorePassword}&format=json`
      });

      return response.data;
  }
  catch (err) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Payment validation failed!")
  }
};




export const SSLServices = {
  initPayment,
  validatePayment
};
