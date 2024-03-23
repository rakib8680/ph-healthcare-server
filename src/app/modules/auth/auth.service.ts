import { generateToken } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";

// Login User
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

  // create access token
  const accessToken = generateToken(jwtPayload, "secret", "5m");

  // create refresh token
  const refreshToken = generateToken(jwtPayload, "verySecret", "30d");

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
    decoded = jwt.verify(token, "verySecret") as JwtPayload;
  } catch (error) {
    throw new Error("You are not authorized");
  }

  // find the user from the database
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decoded.email,
    },
  });

  //   jwt payload
  const jwtPayload = {
    email: userData.email,
    role: userData.role,
  };
  // create access token
  const accessToken = generateToken(jwtPayload, "secret", "5m");

  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

export const AuthServices = {
  loginUser,
  refreshToken,
};
