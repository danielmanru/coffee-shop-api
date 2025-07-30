import { validate } from "../validations/validation.js"
import {
  getMenuByCategoryValidation,
  addMenuValidation,
  updateMenuValidation,
} from "../validations/menu-validation.js"
import Menu from "../models/menu.model.js";
import {ResponseError} from "../error/response-error.js";
import idValidation from "../validations/id-validation.js";

const getAllMenus = async() => {
   return Menu.find( {} );
}

const getMenuByCategory = async(request) => {
  const req = validate(getMenuByCategoryValidation, request);
  const menus = await Menu.find( { category : req } );
  if (!menus) {
    throw new ResponseError(404, `Menus with category ${req} are not found!`);
  }
  return menus;
}

const getAvailableMenu = async() => {
  const menus = await Menu.find( { isAvailable: true } );
  if(!menus){
    throw new ResponseError(404, `All menus are unavailable!`);
  }
  return menus;
}

const getMenuById = async (menuId) => {
  const menu_id = validate(idValidation, menuId);
  const menu = await Menu.findById(menu_id);
  if (!menu) {
    throw new ResponseError(404, 'Menu is not found!');
  }

  return menu;
}

const addMenu = async(request) => {
  const req = validate(addMenuValidation, request);
  const menu = await Menu.findOne( { name : req.name } );
  if (menu) {
    throw new ResponseError(400, 'Menu already exists!');
  }

  return Menu.create(req);
}

const updateMenu = async(request, menuId) => {
  const req = validate(updateMenuValidation, request);
  const menu_id = validate(idValidation, menuId);
  const menu = await Menu.findByIdAndUpdate(
    menu_id,
    { $set: req },
    { new: true }
  );

  if (!menu) {
    throw new ResponseError(404, 'Menu is not found!');
  }

  return menu;
}

const deleteMenu = async(menuId) => {
  const menu_id = validate(idValidation, menuId);
  const deletedMenu = await Menu.findByIdAndDelete(menu_id);

  if(!deletedMenu) {
    throw new ResponseError(404, 'Menu is not found!');
  }

  return null;
}

export default {
  addMenu,
  getMenuByCategory,
  getAvailableMenu,
  getMenuById,
  getAllMenus,
  updateMenu,
  deleteMenu,
}