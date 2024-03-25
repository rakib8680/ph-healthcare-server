import { UserStatus } from "@prisma/client";
import { generateToken, verifyToken } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import config from "../../../config";
import { JwtPayload, Secret } from "jsonwebtoken";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { sendMail } from "./emailSender";



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
  }

  // check if the new password is same as the old password
  if (payload.oldPassword === payload.newPassword) {
    throw new ApiError(
      httpStatus.NOT_ACCEPTABLE,
      "New password can not be same as old password"
    );
  }

  // hash the new password
  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

  // update the password
  await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: "Password changed successfully",
  };
};



// forgot password
const forgotPassword = async (payload: { email: string }) => {
  // check if user exists
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  // create a reset password token
  const jwtPayload = {
    email: userData.email,
    role: userData.role,
  };
  const resetPasswordToken = generateToken(
    jwtPayload,
    config.resetPasswordSecret as Secret,
    config.resetTokenExp as string
  );

  // http://localhost:3000/reset-password?email=admin1@gmail.com&token=asdf

  // create a reset password link
  const resetPasswordLink =
    config.resetPasswordLink +
    `?email=${userData.email}&token=${resetPasswordToken}`;

  // send email
  await sendMail(
    userData.email,
    `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Reset Password</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
      .email-container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 5px;
        box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
      }
      .email-header {
        text-align: center;
        padding: 20px 0;
        border-bottom: 1px solid #ddd;
      }
      .email-content {
        margin-top: 20px;
        line-height: 1.5;
        color: #666;
      }
      .reset-link {
        display: inline-block;
        margin-top: 20px;
        padding: 10px 20px;
        color: #333;
        background-color: #ffffff;
        text-decoration: none;
        border: 1px solid #333;
        border-radius: 5px;
        font-weight: bold;
        transition: all 0.3s ease;
      }

      .reset-link:hover {
        background-color: #f3f3f3;
      }
      .email-footer {
        text-align: center;
        padding: 20px 0;
        border-top: 1px solid #ddd;
        color: #888;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <h2>Hello,</h2>
      </div>
      <p class="email-content">
        We received a request to reset your password. Click the button below to reset it.
      </p>
      <a href="${resetPasswordLink}" class="reset-link">Reset Password</a>
      <p class="email-content">
        If you did not request this, please ignore this email.
      </p>
      <div class="email-footer">
        <p>If you have any questions, please contact our support team.</p>
      </div>
    </div>
  </body>
  </html>`
  );

  return {
    message: "Reset password link has been sent to your email",
  };
};


// reset password
const resetPassword = async (
  token: string,
  payload: { email: string; password: string }
) => {
  // check if user exists
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  // verify the token
  const decoded = verifyToken(token, config.resetPasswordSecret as Secret);
  if (!decoded) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized Access");
  }

  // check if the new password is same as the old password
  const isPasswordMatched: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );
  if (isPasswordMatched) {
    throw new Error("New password can not be same as old password");
  }

  // hash the new password
  const hashedPassword: string = await bcrypt.hash(payload.password, 12);

  // update the password into database
  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
    },
  });

  return {
    message: "Password reset successfully",
  };
};



export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
