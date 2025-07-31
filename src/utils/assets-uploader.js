import newCloudinary from "../config/cloudinary-config.js";
import { Readable } from "stream";
import pLimit from "p-limit";

const limit = pLimit(10);

const singleUpload = async (file, folderName) => {
  return new Promise((resolve, reject) => {
    console.log(typeof folderName)
    const uploadStream = newCloudinary.uploader.upload_stream(
      {
        asset_folder: `coffee_shop_assets/${folderName}`,
        display_name: file.originalname,
        use_filename : true,
        use_asset_folder_as_public_id_prefix : true,
        overwrite: true
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    )
    Readable.from(file.buffer).pipe(uploadStream);
  })
}

const uploadImages = async (files, folderName) => {
  const uploads = files.map((file) => {
    return limit(async () => {
      const result = await singleUpload(file, folderName);
      return result;
    })
  });
  return Promise.all(uploads);
};

export default uploadImages;