import express from "express";
import {authMiddleware} from "../middleware/auth-middleware.js";
import upload from "../middleware/multer-middleware.js";
import outletController from "../controller/outlet-controller.js";

const outletRouter = new express.Router();
outletRouter.get('/api/outlets/getAllOutlet',  outletController.getAllOutlet);
outletRouter.get('/api/outlets/getOutletById/:outletId',  outletController.getOutletById);
outletRouter.post('/api/outlets/addOutlet',  outletController.addOutlet);
outletRouter.put('/api/outlets/updateOutlet',  outletController.updateOutlet);
outletRouter.put('/api/outlets/deleteOutlet/:outletId',  outletController.deleteOutlet);

export default outletRouter;
