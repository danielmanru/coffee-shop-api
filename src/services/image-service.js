import uploadImages from "../utils/assets-uploader.js";
import newCloudinary from "../config/cloudinary-config.js";
import {validate} from "../validations/validation.js";
import {ResponseError} from "../error/response-error.js";
import {addImagesValidation, deleteImagesValidation} from "../validations/image-validation.js";
import Menu from "../models/menu.model.js";
import Outlet from "../models/outlet.model.js";

const addImages = async(itemId, files, modelName) => {
  let folderName;
  let Model;
  if (modelName === "Menu") {
    folderName = "menu-assets";
    Model = Menu;
  } else if (modelName === "Outlet") {
    folderName = "outlet-assets";
    Model = Outlet;
  }

  const request = {
    item_id: itemId,
    model_name: modelName,
    asset_folder: folderName,
    image_metadata: []
  }

  files.map(file => request.image_metadata.push({
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,}))
  const req = validate(addImagesValidation, request)
  const imagesUploaded = await uploadImages(files, req.asset_folder);

  const imagesToInsert = imagesUploaded.map((image) => ({
    url: image.secure_url,
    publicId: image.public_id,
  }));

  const updatedImages = await Model.findByIdAndUpdate(
    itemId,
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
    throw new ResponseError(404, `${modelName} is not found!`);
  }

  return updatedImages;
}

const deleteImages = async(itemId, publicIds, modelName) => {
  let Model;
  if (modelName === "Menu") {
    Model = Menu;
  } else if (modelName === "Outlet") {
    Model = Outlet;
  }
  const req = validate(deleteImagesValidation, {
    item_id  : itemId,
    model_name: modelName,
    publicIds : publicIds
  });

  req.publicIds.map(async(publicId) => await newCloudinary.uploader.destroy(publicId));

  const updatedImages = await Model.findByIdAndUpdate(
    itemId,
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
    throw new ResponseError(404, `${modelName} is not found!`);
  }

  return updatedImages;
}

export default {
  addImages,
  deleteImages,
}