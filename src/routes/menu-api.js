import express from "express";
import menuController from "../controllers/menu-controller.js";
import { authMiddleware } from "../middlewares/auth-middleware.js";

const menuRouter = new express.Router();
menuRouter.get('/', menuController.getAllMenus)
menuRouter.post('/addMenu', authMiddleware(["admin"]), menuController.addMenu)
menuRouter.get('/getMenuByCategory/:category', menuController.getMenuByCategory)
menuRouter.get('/getAvailableMenu', menuController.getAvailableMenu)
menuRouter.get('/getMenuById/:menuId', menuController.getMenuById)
menuRouter.put('/updateMenu', authMiddleware(["admin"]),menuController.updateMenu)
menuRouter.delete('/deleteMenu', authMiddleware(["admin"]),menuController.deleteMenu)

export default  menuRouter;