import express from "express";
import errorMiddleware from "../middleware/error-middleware.js";
import morganMiddleware from "../middleware/morgan-middleware.js";
import publicRouter from "../route/public-api.js";
import userRouter from "../route/user-api.js";
import menuRouter from "../route/menu-api.js";
import outletRouter from "../route/outlet-api.js";
import imageRouter from "../route/image-api.js";

export const web = express();

web.use(express.json())
web.use(morganMiddleware);
web.use(publicRouter);
web.use(userRouter);
web.use(menuRouter);
web.use(outletRouter);
web.use(imageRouter);
web.use(errorMiddleware);
