import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { uploadMultiple, uploadSingle } from "../middleware/upload";
import { uploadController } from "../controllers/upload.controller";

const router = Router();

// admin upload 1 image
router.post(
  "/single",
  authenticate,
  authorize("ADMIN"),
  uploadSingle as any,
  uploadController.uploadSingle,
);

// admin upload many images
router.post(
  "/multiple",
  authenticate,
  authorize("ADMIN"),
  uploadMultiple as any,
  uploadController.uploadMultiple,
);


// admin delete  image
router.delete(
  "/:publicId",
  authenticate,
  authorize("ADMIN"),
  uploadMultiple as any,
  uploadController.deleteImage,
);

export default router;
