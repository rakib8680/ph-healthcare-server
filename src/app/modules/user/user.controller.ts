import { userServices } from "./user.service";
import catchAsync from "../../../shared/catchAsync";



// create admin
const createAdmin = catchAsync(async (req, res) => {
  const result = await userServices.createAdminIntoDB(req);
  res.status(200).json({
    success: true,
    message: "Admin created successfully!",
    data: result,
  });
});



// create doctor
const createDoctor = catchAsync(async (req, res) => {
  const result = await userServices.createDoctorIntoDB(req);
  res.status(200).json({
    success: true,
    message: "Doctor created successfully!",
    data: result,
  });
});




export const userControllers = {
  createAdmin,
  createDoctor,
};
