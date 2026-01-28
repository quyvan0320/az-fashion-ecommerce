import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { uploadSingle } from "../middleware/upload";
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

export default router;
