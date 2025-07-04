import uploadImages from "../utils/assets-uploader.js";
import newCloudinary from "../config/cloudinary-config.js";
import {validate} from "../validations/validation.js";
import Menu from "../models/menu.model.js";
import {ResponseError} from "../error/response-error.js";
import {addImagesValidation, deleteImagesValidation} from "../validations/image-validation.js";

const addImages = async(menuId, files, folderName) => {
  const request = {
    menu_id: menuId,
    asset_folder: folderName,
    image_metadata: []
  }

  files.map(file => request.image_metadata.push({
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,}))
  validate(addImagesValidation, request)
  const imagesUploaded = await uploadImages(files, folderName);

  const imagesToInsert = imagesUploaded.map((image) => ({
    url: image.secure_url,
    publicId: image.public_id,
  }));

  const updatedImages = await Menu.findByIdAndUpdate(
    menuId,
    {
      $push: {
        images : {
          $each: imagesToInsert
        }
      }
    },
    { new: true }
  );

  if(!updatedImages) {
    throw new ResponseError(404, 'Menu is not found!');
  }

  return updatedImages;
}

const deleteImages = async(menuId, publicIds,) => {
  const req = validate(deleteImagesValidation, {
    menuId  : menuId,
    publicIds : publicIds,
  });

  req.publicIds.map(async(publicId) => await newCloudinary.uploader.destroy(publicId));

  const updatedImages = await Menu.findByIdAndUpdate(
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

  if(!updatedImages) {
    throw new ResponseError(404, 'Menu is not found!');
  }

  return updatedImages;
}

export default {
  addImages,
  deleteImages,
}