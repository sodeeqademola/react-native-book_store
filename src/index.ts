import express, { Request, Response } from "express";
import { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import Connection from "./connection";
import userRouter from "./routes/userRoutes";
import bookRouter from "./routes/bookRoutes";

const app: Application = express();

// middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb" }));
app.use(cors());
app.use(morgan("dev"));

// dotenv
dotenv.config();

// connect to database
Connection();

// routers
app.use("/api", userRouter);
app.use("/api", bookRouter);

app.use("/", (req: Request, res: Response) => {
  res.status(201).send({
    success: true,
    message: "welcome to index page",
  });
});

const PORT = (process.env.PORT as string) || 9000;

app.listen(PORT, () => {
  return console.log("connected  to port " + PORT);
});
