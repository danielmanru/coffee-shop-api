import menuService from "../services/menu-service.js";

const addMenu = async(req, res, next) => {
  try {
    const result = await menuService.addMenu(req.body);
    res.status(200).json({
      success: true,
      message: "Success create menu",
      data: result
    });
  } catch (err) {
    next(err);
  }
}

const getAllMenus = async(req, res, next) => {
  try {
    const result = await menuService.getAllMenus();
    res.status(200).json({
      success: true,
      message: "Success get all menus",
      data: result
    });
  } catch (err) {
    next(err);
  }
}

const getMenuByCategory = async(req, res, next) => {
  try {
    const result = await menuService.getMenuByCategory(req.params.category);
    res.status(200).json({
      success: true,
      message: "Success get menu with category " + result[0].category,
      data: result
    });
  } catch (err) {
    next(err);
  }
}

const getAvailableMenu = async(req, res, next) => {
  try {
    const result = await menuService.getAvailableMenu();
    res.status(200).json({
      success: true,
      message: "Success get available menu",
      data: result
    });
  } catch (err) {
    next(err);
  }
}

const getMenuById = async(req, res, next) => {
  try {
    const result = await menuService.getMenuById(req.params.menuId);
    res.status(200).json({
      success: true,
      message: "Success get menu with id" + result._id,
      data: result
    });
  } catch (err) {
    next(err);
  }
}

const updateMenu = async(req, res, next) => {
  try {
    const result = await menuService.updateMenu(req.body, req.query.menuId);
    res.status(200).json({
      success: true,
      message: "Success update menu",
      data: result
    });
  } catch (err) {
    next(err);
  }
}

const deleteMenu = async(req, res, next) => {
  try {
    const result = await menuService.deleteMenu(req.query.menuId);
    res.status(200).json({
      success: true,
      message: "Success delete menu",
      data: result
    });
  } catch (err) {
    next(err);
  }
}

export default {
  addMenu,
  getAllMenus,
  getMenuByCategory,
  getAvailableMenu,
  getMenuById,
  updateMenu,
  deleteMenu
}