import express from "express";
import menuController from "../controllers/menu-controller.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";
import upload from "../middlewares/multer-middleware.js";

const menuRouter = new express.Router();
menuRouter.get('/', menuController.getAllMenus)
menuRouter.post('/addMenu', authMiddleware(["admin"]), menuController.addMenu)
menuRouter.get('/getMenuByCategory', menuController.getMenuByCategory)
menuRouter.get('/getMenuByItsAvailability', menuController.getMenuByItsAvailability)
menuRouter.get('/getMenuById', menuController.getMenuById)
menuRouter.put('/updateMenu/:menuId', authMiddleware(["admin"]),menuController.updateMenu)
menuRouter.delete('/deleteMenu/:menuId', authMiddleware(["admin"]),menuController.updateMenu)

export default  menuRouter;