import {logger} from "./logger.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

const dbConnListener = () =>{
  mongoose.connection.on('disconnected', () => {
    logger.error("Mongo DB disconnected");
  });

  mongoose.connection.on('connected', () => {
    logger.info("Mongo DB connected");
  });
}

export {
  connectDb,
  dbConnListener
}