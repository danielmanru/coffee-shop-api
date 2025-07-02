import newCloudinary from "../config/cloudinary-config.js";
import { Readable } from "stream";
import pLimit from "p-limit";

const limit = pLimit(10);

const singleUpload = async (file, folderName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = newCloudinary.uploader.upload_stream(
      {
        asset_folder: folderName,
        display_name: file.originalname,
        public_id: file.originalname,
        use_asset_folder_as_public_id_prefix : true
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    )
    Readable.from(file.buffer).pipe(uploadStream);
  })
}

const uploadImages = async (files) => {
  const uploads = files.map((file) => {
    return limit(async () => {
      const result = await singleUpload(file);
      return result;
    })
  });
  return Promise.all(uploads);
};

export default uploadImages;