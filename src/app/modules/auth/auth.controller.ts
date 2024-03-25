import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AuthServices } from "./auth.service";
import { Request } from "express";

// Login User
const loginUser = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthServices.loginUser(payload);

  // set refresh token in cookie
  const { refreshToken } = result;
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      accessToken: result.accessToken,
      needPasswordChange: result.needPasswordChange,
    },
  });
});

// generate new access token using refresh token
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token generated successfully",
    data: result,
  });
});

// change password
const changePassword = catchAsync(
  async (req: Request & { user?: any }, res) => {
    const user = req.user;
    const payload = req.body;

    const result = await AuthServices.changePassword(user, payload);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password changed successfully",
      data: result,
    });
  }
);

// forgot password
const forgotPassword = catchAsync(async (req, res) => {

  const result = await AuthServices.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:"A reset password link has been sent to your email address. Please check your email.",
    data: result,
  });
});


// reset password
const resetPassword = catchAsync(async (req, res) => {

  const token = req.headers.authorization || "";
  const payload = req.body

  const result = await AuthServices.resetPassword(token, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully",
    data: result,
  });
});

export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
