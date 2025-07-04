import express from "express";
import {authMiddleware} from "../middlewares/auth-middleware.js";
import upload from "../middlewares/multer-middleware.js";
import outletController from "../controllers/outlet-controller.js";

const outletRouter = new express.Router();
outletRouter.get('/getAllOutlet',  outletController.getAllOutlet);
outletRouter.get('/getOutletById/:outletId',  outletController.getOutletById);
outletRouter.post('/addOutlet',  outletController.addOutlet);
outletRouter.put('/updateOutlet',  outletController.updateOutlet);
outletRouter.put('/deleteOutlet/:outletId',  outletController.deleteOutlet);

export default outletRouter;
