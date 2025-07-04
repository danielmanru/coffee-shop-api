import imageService from "../services/image-service.js";

const addImage = async(req, res, next) => {
  try {
    const result = await imageService.addImage(req.query.menuId, req.files);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
}

const deleteImage = async(req, res, next) => {
  try {
    const result = await imageService.deleteImage(req.query.menuId, req.query.publicIds.split(','));
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
}

export default {
  addImage,
  deleteImage
}