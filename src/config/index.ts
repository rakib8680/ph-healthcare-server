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
};
