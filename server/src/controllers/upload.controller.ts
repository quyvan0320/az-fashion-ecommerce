import { Request, Response, NextFunction } from "express";
import { AppError } from "../middleware/errorHandler";
import { uploadService } from "../services/upload.service";

export const uploadController = {
  async uploadSingle(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new AppError("Không có tệp nào được tải lên", 400);
      }

      const result = await uploadService.uploadSingle(req.file);
      res.json({
        success: true,
        message: "Hình ảnh được tải lên thành công",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // upload manu images
  async uploadMultiple(req: Request, res: Response, next: NextFunction) {
    try {
      const files = req.files as Express.Multer.File[];
      if (!req.files || files.length === 0) {
        throw new AppError("Không có tệp nào được tải lên", 400);
      }

      if (files.length > 10) {
        throw new AppError("Chỉ tối đa 10 ảnh", 400);
      }
      const results = await uploadService.uploadMultiple(files);
      res.json({
        success: true,
        message: `${results.length} tệp được tải lên thành công`,
        data: results,
      });
    } catch (error) {
      next(error);
    }
  },

  // delete image
  async deleteImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { publicId } = req.body;

      if (!publicId) throw new AppError("Không có Public id", 400);
      await uploadService.deleteImage(publicId);
      res.json({
        success: true,
        message: "Hình ảnh đã được xóa thành công",
      });
    } catch (error) {
      next(error);
    }
  },
};
