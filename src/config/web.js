import express from "express";
import errorMiddleware from "../middlewares/error-middleware.js";
import morganMiddleware from "../middlewares/morgan-middleware.js";
import router from "../routes/index.js";

export const web = express();

web.use(express.json())
web.use(morganMiddleware);
web.use('/api/v1', router);
web.use(errorMiddleware);
