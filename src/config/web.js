import express from "express";
import { publicRouter } from "../route/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { userRouter } from "../route/user-api.js";
import morganMiddleware from "../middleware/morgan-middleware.js";
import {menuRouter} from "../route/menu-api.js";

export const web = express();

web.use(express.json())
web.use(morganMiddleware);
web.use(publicRouter);
web.use(userRouter);
web.use(menuRouter);
web.use(errorMiddleware);
