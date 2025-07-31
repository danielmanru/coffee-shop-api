import uploadImages from "../utils/assets-uploader.js";
import newCloudinary from "../config/cloudinary-config.js";
import {validate} from "../validations/validation.js";
import {ResponseError} from "../error/response-error.js";
import {addImagesValidation, deleteImagesValidation} from "../validations/image-validation.js";
import Menu from "../models/menu.model.js";
import Outlet from "../models/outlet.model.js";

const addImages = async(documentId, files, modelName) => {
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
    document_id: documentId,
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
    documentId,
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

const deleteImages = async(documentId, publicIds, modelName) => {
  let Model;
  if (modelName === "Menu") {
    Model = Menu;
  } else if (modelName === "Outlet") {
    Model = Outlet;
  }
  const req = validate(deleteImagesValidation, {
    document_id  : documentId,
    model_name: modelName,
    publicIds : publicIds
  });
  
  const document = await Model.findById(documentId);

  if(!document) {
    throw new ResponseError(404, `${modelName} is not found!`);
  }

  const existingPublicId = document.images.map(img => img.publicId);
  const notFoundId = req.publicIds.filter(id => !existingPublicId.includes(id));

  if(notFoundId.length > 0) {
    throw new ResponseError(404, `One of PublicIdS is not found!`);
  }

  req.publicIds.map(async(publicId) => await newCloudinary.uploader.destroy(publicId));

  document.images = document.images.filter(img => !req.publicIds.includes(img.publicId));

  return document;
}

export default {
  addImages,
  deleteImages,
}