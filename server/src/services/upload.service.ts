import cloudinary from "../config/cloudinary";
import { AppError } from "../middleware/errorHandler";
import streamifier from "streamifier";
export const uploadService = {
  // upload 1 pic to cloudinary
  async uploadSingle(file: Express.Multer.File, folder: string = "products") {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `az-fashion/${folder}`,
            resource_type: "image",
            transformation: [
              { width: 1000, height: 1000, crop: "limit" }, // 1000 x 1000
              { quality: "auto" },
              { fetch_format: "auto" },
            ],
          },
          (error, result) => {
            if (error) {
              reject(new AppError("Tải lên không thành công", 500));
            } else {
              resolve({
                url: result?.secure_url,
                publicId: result?.public_id,
              });
            }
          },
        );

        // Convert buffer to stream and upload
        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });
    } catch (error) {
      throw new AppError("Không thể tải hình ảnh lên", 500);
    }
  },

  // upload many images
  async uploadMultiple(
    files: Express.Multer.File[],
    folder: string = "products",
  ) {
    try {
      const uploadPromises = files.map((file) => {
        return this.uploadSingle(file, folder);
      });
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      throw new AppError("Không thể tải hình ảnh lên", 500);
    }
  },
};
