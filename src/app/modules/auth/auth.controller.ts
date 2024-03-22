import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { authServices } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await authServices.loginUser(payload);

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

export const authController = {
  loginUser,
};
