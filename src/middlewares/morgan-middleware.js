import morgan from "morgan";

import {logger} from "../config/logger.js";

const stream= {
  write: (message) => logger.http(message),
};

const skip = () => {
  const env = process.env.NODE_ENV || "production";
  return env !== "production";
};

const morganMiddleware = morgan(
  // ":method :url :status :res[content-length] - :response-time ms",
  "dev",
  { stream, skip }
);

export default morganMiddleware;