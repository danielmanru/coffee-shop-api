import express from "express";
import { publicRouter } from "../route/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { userRouter } from "../route/user-api.js";
import morgan from "morgan";
import morganMiddleware from "../middleware/morganMiddleware.js";

export const web = express();

web.use(express.json())
web.use(morganMiddleware);
web.use(publicRouter);
web.use(userRouter);
web.use(errorMiddleware);
