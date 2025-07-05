import express from "express";
import {authMiddleware} from "../middlewares/auth-middleware.js";
import upload from "../middlewares/multer-middleware.js";
import outletController from "../controllers/outlet-controller.js";

const outletRouter = new express.Router();
outletRouter.get('/getAllOutlet',  outletController.getAllOutlet);
outletRouter.get('/getOutletById/:outletId',  outletController.getOutletById);
outletRouter.post('/addOutlet', authMiddleware(["admin"]),  outletController.addOutlet);
outletRouter.put('/updateOutlet', authMiddleware(["admin"]), outletController.updateOutlet);
outletRouter.put('/deleteOutlet/:outletId', authMiddleware(["admin"]), outletController.deleteOutlet);

export default outletRouter;
