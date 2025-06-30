import imageUpload from "../lib/image-uploader.js";
import newCloudinary from "../config/cloudinary-config.js";

const uploadImage = async(file) => {
  const uploadedImages = await imageUpload(file);

  return uploadedImages.map((image) => ({
    url: image.secure_url,
    publicId: image.public_id,
  }));
};

const deleteImage = async(publicId) => {
  return newCloudinary.uploader.destroy(publicId);
};

export default {
  uploadImage,
  deleteImage,
}