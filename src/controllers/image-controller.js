import imageService from "../services/image-service.js";

const addImages = async(req, res, next) => {
  try {
    const result = await imageService.addImages(req.query.itemId, req.files, req.params.modelName);
    res.status(200).json({
      success: true,
      message: "Image added successfully",
      data: result
    });
  } catch (err) {
    next(err);
  }
}

const deleteImages = async(req, res, next) => {
  try {
    const result = await imageService.deleteImages(req.query.itemId, req.query.publicIds.split(','), req.params.modelName);
    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      data: result
    });
  } catch (err) {
    next(err);
  }
}

export default {
  addImages,
  deleteImages
}