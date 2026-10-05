import "dotenv/config";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

import path from "path";

import { router } from "./routes/authRouter.js";
import { errorMiddleware } from "./middlewares/error.middlewere.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

const _dirname = path.resolve();

//routes
app.use("/api/v1/auth", router);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(_dirname, "frontend/dist"));

  app.get("*", (req, res) => {
    res.sendFile(_dirname, "frontend", "dist", "index.html");
  });
}

//middleware
app.use(errorMiddleware);

export { app };
