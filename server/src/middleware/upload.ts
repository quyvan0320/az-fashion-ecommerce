import multer from "multer";
import { Request } from "express";
import { AppError } from "./errorHandler";

// config multer storage memory not save file
const storage = multer.memoryStorage();

// only image
const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
): void => {
  //image types
  const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Loại tệp không hợp lệ chỉ cho phép JPEG, JPG, PNG và WEBP",
        400,
      ) as any,
    );
  }
};

// config multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max per file
  },
});

export const uploadSingle = upload.single('image') // 1 pic
export const uploadMultiple = upload.array('images', 10) // 10 pics

export default upload