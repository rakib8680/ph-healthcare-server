import { UserStatus } from "@prisma/client";
import { generateToken, verifyToken } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import config from "../../../config";
import { JwtPayload, Secret } from "jsonwebtoken";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";



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




// change password
const changePassword = async (
  user: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {

  // check if user exists
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });


  // check if old password is correct
  const isPasswordMatched: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isPasswordMatched) {
    throw new Error("Current Password does not match");
  };


  // check if the new password is same as the old password
  if (payload.oldPassword === payload.newPassword) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE,"New password can not be same as old password");
  };


  // hash the new password
  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

  // update the password
  await prisma.user.update({
    where: {
      email:user.email
    },
    data:{
      password: hashedPassword,
      needPasswordChange: false
    }
  });


  return {
    message: "Password changed successfully",
  }


};




export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
};
