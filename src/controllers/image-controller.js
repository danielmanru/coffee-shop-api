import imageService from "../services/image-service.js";

const addImages = async(req, res, next) => {
  try {
    const result = await imageService.addImages(req.query.documentId, req.files, req.params.uploadFor);
    res.status(201).json({
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
    const result = await imageService.deleteImages(req.query.documentId, req.query.publicIds.split(','), req.params.deleteFor);
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