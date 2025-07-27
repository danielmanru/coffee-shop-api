import dotenv from "dotenv";
dotenv.config();
import { web } from "./config/web.js";
import { logger } from "./config/logger.js";
import {connectDb, dbConnListener} from "./config/db.js";

const { PORT } = process.env;

dbConnListener();

web.listen(PORT, ()=>{
  connectDb();
  logger.info(`App Start at Port ${PORT}`);
})

export default web;