import web from "../src/main.js";
import {connectDb, dbConnListener} from "../src/config/db.js";

dbConnListener();
connectDb();

export default web;