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



// create patient 
const createPatient = catchAsync(async (req, res) => {
  const result = await userServices.createPatientIntoDB(req);
  res.status(200).json({
    success: true,
    message: "Patient created successfully!",
    data: result,
  });
});



export const userControllers = {
  createAdmin,
  createDoctor,
  createPatient,
};
