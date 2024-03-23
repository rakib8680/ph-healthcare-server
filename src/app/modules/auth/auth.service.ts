import { UserStatus } from "@prisma/client";
import { generateToken, verifyToken } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import config from "../../../config";
import { Secret } from "jsonwebtoken";

// Login User
const loginUser = async (payload: { email: string; password: string }) => {
  // check if user exists
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
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

  // create access token
  const accessToken = generateToken(
    jwtPayload,
    config.jwtAccessSecret as Secret,
    config.jwtAccessExp as string
  );

  // create refresh token
  const refreshToken = generateToken(
    jwtPayload,
    config.jwtRefreshSecret as Secret,
    config.jwtRefreshExp as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};




// generate new access token using refresh token
const refreshToken = async (token: string) => {

  // verify the token
  let decoded;

  try {
    decoded = verifyToken(token, config.jwtRefreshSecret as Secret);
  } catch (error) {
    throw new Error("You are not authorized");
  }

  // find the user from the database
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decoded.email,
      status: UserStatus.ACTIVE,
    },
  });


  //   jwt payload
  const jwtPayload = {
    email: userData.email,
    role: userData.role,
  };
  // create access token
  const accessToken = generateToken(
    jwtPayload,
    config.jwtAccessSecret as Secret,
    config.jwtAccessExp as string
  );

  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};




export const AuthServices = {
  loginUser,
  refreshToken,
};
