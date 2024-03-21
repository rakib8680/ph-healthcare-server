import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";

const app: Application = express();
app.use(cors());

// parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
