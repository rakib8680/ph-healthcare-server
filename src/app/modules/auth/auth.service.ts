import { generateToken } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";

const loginUser = async (payload: { email: string; password: string }) => {
  // check if user exists
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  //   check if password is matched
  const isPasswordMatched: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isPasswordMatched) {
    throw new Error("Invalid password");
  }

  //   jwt payload
  const jwtPayload = {
    email: userData.email,
    role: userData.role,
  };

  //   create access token
  const accessToken = generateToken(jwtPayload, "secret", "5m");

  // create refresh token
  const refreshToken = generateToken(jwtPayload, "verySecret", "30d");

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

export const authServices = {
  loginUser,
};
