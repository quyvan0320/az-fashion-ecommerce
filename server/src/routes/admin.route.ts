import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { adminController } from "../controllers/admin.controller";

const router = Router();


router.use(authenticate, authorize('ADMIN')); 

router.get(
  "/dashboard",
  adminController.getDashboard,
);

export default router;
