import express from "express";
import menuController from "../controller/menu-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import upload from "../middleware/multer-middleware.js";

const menuRouter = new express.Router();
menuRouter.get('/api/menus', menuController.getAllMenus)
menuRouter.post('/api/menus/addMenu', authMiddleware(["admin"]), menuController.addMenu)
menuRouter.get('/api/menus/getMenuByCategory', menuController.getMenuByCategory)
menuRouter.get('/api/menus/getMenuByItsAvailability', menuController.getMenuByItsAvailability)
menuRouter.get('/api/menus/getMenuById', menuController.getMenuById)
menuRouter.put('/api/menus/updateMenu/:menuId', authMiddleware(["admin"]),menuController.updateMenu)
menuRouter.delete('/api/menus/deleteMenu/:menuId', authMiddleware(["admin"]),menuController.updateMenu)
menuRouter.post('/api/menus/addImage', authMiddleware(["admin"]), upload.array("images", 10), menuController.addImage)
menuRouter.put('/api/menus/deleteImage', authMiddleware(["admin"]), menuController.deleteImage)

export{
  menuRouter
}