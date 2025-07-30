import {logger} from "./logger.js";
import mongoose from "mongoose";

const MONGODB_URI = (process.env.NODE_ENV === 'development') ? process.env.MONGODB_URI_DEV : process.env.MONGODB_URI_PROD

const connectDb = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
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
    const dbName = mongoose.connection.name
    logger.info(`Connected to DB : ${dbName}`);
  });
}

export {
  connectDb,
  dbConnListener
}