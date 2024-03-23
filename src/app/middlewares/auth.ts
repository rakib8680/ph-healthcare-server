import { Secret } from "jsonwebtoken";
import config from "../../config";
import { verifyToken } from "../../helpers/jwtHelpers";
import catchAsync from "../../shared/catchAsync";

const auth = (...roles: string[]) => {
  return catchAsync(async (req, res, next) => {
    // get the token from client
    const token = req.headers.authorization;
    if (!token) throw new Error("You are not authorized");

    // verify the token
    const decodedData = verifyToken(token, config.jwtAccessSecret as Secret);

    if (roles.length && !roles.includes(decodedData.role)) {
      throw new Error("You are not authorized");
    }

    next();
  });
};

export default auth;
