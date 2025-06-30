import { validate } from "../validation/validation.js"
import {
  getMenuByCategoryValidation,
  getMenuByItsAvailabilityValidation,
  getMenuByIdValidation,
  addMenuValidation,
  updateMenuValidation,
  deleteMenuValidation,
  addImageValidation,
  deleteImageValidation,
} from "../validation/menu-validation.js"
import Menu from "../model/menu.model.js";
import {ResponseError} from "../error/response-error.js";
import imageService from "./image-service.js";
import {request} from "express";

const getAllMenus = async() => {
   return Menu.find( {} );
}

const getMenuByCategory = async(request) => {
  const req = validate(getMenuByCategoryValidation, request);
  return Menu.find( { category : req } );
}

const getMenuByItsAvailability = async(request) => {
  const req = validate(getMenuByItsAvailabilityValidation, request);
  return Menu.find( { isAvailable: req } );
}

const getMenuById = async (menuId) => {
  const menu_id = validate(getMenuByIdValidation(menuId));
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

const addImage = async(menuId, files) => {
  const request = {
    menu_id: menuId,
    image_metadata: []
  }

  files.map(file => request.image_metadata.push({
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,}))
  validate(addImageValidation, request)
  const imageUploaded = await imageService.uploadImage(files);

  const updatedImage = await Menu.findByIdAndUpdate(
    menuId,
    {
      $push: {
        images : {
          $each: imageUploaded
        }
      }
    },
    { new: true }
  );

  if(!updatedImage) {
    throw new ResponseError(404, 'Menu is not found!');
  }

  return updatedImage;
}

const deleteImage = async(menuId, publicIds,) => {
  const req = validate(deleteImageValidation, {
    menuId  : menuId,
    publicIds : publicIds,
  });

  req.publicIds.map(publicId => imageService.deleteImage(publicId));


  const updatedImage = await Menu.findByIdAndUpdate(
    req.menuId,
    {
      $pull: {
        images : {
          publicId: { $in: publicIds }
        }
      }
    },
    { new: true }
  );

  if(!updatedImage) {
    throw new ResponseError(404, 'Menu is not found!');
  }

  return updatedImage;
}

const updateMenu = async(request) => {
  const req = validate(updateMenuValidation, request.body);
  const menu = await Menu.findByIdAndUpdate(
    request.params.menuId,
    { $set: req },
    { new: true }
  );
  if (!menu) {
    throw new ResponseError(404, 'Menu is not found!');
  }

  return menu;
}

const deleteMenu = async(menuId) => {
  const menu_id = validate(deleteMenuValidation, menuId);
  const deletedMenu = await Menu.findByIdAndDelete(menu_id);

  if(!deletedMenu) {
    throw new ResponseError(404, 'Menu is not found!');
  }

  return null;
}

export default {
  addMenu,
  getMenuByCategory,
  getMenuByItsAvailability,
  getMenuById,
  getAllMenus,
  updateMenu,
  deleteMenu,
  addImage,
  deleteImage,
}