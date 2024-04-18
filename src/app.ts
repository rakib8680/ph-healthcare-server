import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import { AppointmentService } from "./app/modules/Appointment/appointment.service";
import cron from "node-cron";


const app: Application = express();


// middlewares
app.use(cors());

// parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// cancel unpaid appointments
cron.schedule("* * * * *", () => {
  try {
    AppointmentService.cancelUnpaidAppointments();
  } catch (error) {
    console.log(error);
  }
});



// application routes
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Ph Health Care Centre",
  });
});



// global error handler
app.use(globalErrorHandler);

// not found error
app.use(notFound);



export default app;
