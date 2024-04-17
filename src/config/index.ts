import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwtRefreshSecret: process.env.REFRESH_TOKEN_SECRET,
  jwtAccessSecret: process.env.ACCESS_TOKEN_SECRET,
  jwtAccessExp: process.env.ACCESS_EXPIRES_IN,
  jwtRefreshExp: process.env.REFRESH_EXPIRES_IN,
  resetPasswordSecret: process.env.RESET_PASSWORD_SECRET,
  resetTokenExp: process.env.RESET_TOKEN_EXPIRES_IN,
  resetPasswordLink : process.env.RESET_PASSWORD_LINK,

  appEmail: process.env.APP_EMAIL,
  appPassword: process.env.APP_PASSWORD,

  sslStoreId : process.env.STORE_ID,
  sslStorePassword : process.env.STORE_PASSWORD,
  sslSuccessUrl : process.env.SUCCESS_URL,
  sslFailUrl : process.env.FAIL_URL,
  sslCancelUrl : process.env.CANCEL_URL,
  sslPaymentApi : process.env.SSL_PAYMENT_API,
  sslValidationApi : process.env.SSL_VALIDATION_API,
};
