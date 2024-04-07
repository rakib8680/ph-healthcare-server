import express from "express";
import { userRoutes } from "../modules/user/user.routes";
import { adminRoutes } from "../modules/Admin/admin.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { SpecialtiesRoutes } from "../modules/Specialties/specialties.routes";
import { DoctorRoutes } from "../modules/Doctor/doctor.routes";
import { PatientRoutes } from "../modules/Patient/patient.routes";
import { ScheduleRoutes } from "../modules/Schedule/schedule.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/admin",
    route: adminRoutes,
  },
  {
    path: "/doctor",
    route: DoctorRoutes,
  },
  {
    path: "/patient",
    route: PatientRoutes,
  },

  {
    path: "/specialties",
    route: SpecialtiesRoutes,
  },

  {
    path: "/schedule",
    route: ScheduleRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
