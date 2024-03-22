import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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



  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

export const authServices = {
  loginUser,
};
