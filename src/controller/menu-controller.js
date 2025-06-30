import menuService from "../service/menu-service.js";

const addMenu = async(req, res, next) => {
  try {
    const result = await menuService.addMenu(req.body);
    res.status(200).json({
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
      data: result
    });
  } catch (err) {
    next(err);
  }
}

const getMenuByCategory = async(req, res, next) => {
  try {
    const result = await menuService.getMenuByCategory();
    res.status(200).json({
      data: result
    });
  } catch (err) {
    next(err);
  }
}

const getMenuByItsAvailability = async(req, res, next) => {
  try {
    const result = await menuService.getMenuByItsAvailability();
    res.status(200).json({
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
      data: result
    });
  } catch (err) {
    next(err);
  }
}

const addImage = async(req, res, next) => {
  try {
    const result = await menuService.addImage(req.query.menuId, req.files);
    res.status(200).json({
      data: result
    });
  } catch (err) {
    next(err);
  }
}

const deleteImage = async(req, res, next) => {
  try {
    const result = await menuService.deleteImage(req.query.menuId, req.query.publicIds.split(','));
    res.status(200).json({
      data: result
    });
  } catch (err) {
    next(err);
  }
}

const updateMenu = async(req, res, next) => {
  try {
    const result = await menuService.updateMenu(req);
    res.status(200).json({
      data: result
    });
  } catch (err) {
    next(err);
  }
}

const deleteMenu = async(req, res, next) => {
  try {
    const result = await menuService.deleteMenu(req.params.menuId);
    res.status(200).json({
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
  getMenuByItsAvailability,
  getMenuById,
  addImage,
  deleteImage,
  updateMenu,
  deleteMenu
}