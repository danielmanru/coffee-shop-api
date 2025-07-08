import express from "express";
import {authMiddleware} from "../middlewares/auth-middleware.js";
import outletController from "../controllers/outlet-controller.js";

const outletRouter = new express.Router();
outletRouter.get('/',  outletController.getAllOutlet);
outletRouter.get('/searchOutlet',  outletController.searchOutlet);
outletRouter.get('/getOutletById/:outletId',  outletController.getOutletById);
outletRouter.post('/addOutlet', authMiddleware(["admin"]),  outletController.addOutlet);
outletRouter.put('/updateOutlet', authMiddleware(["admin"]), outletController.updateOutlet);
outletRouter.delete('/deleteOutlet', authMiddleware(["admin"]), outletController.deleteOutlet);

export default outletRouter;
