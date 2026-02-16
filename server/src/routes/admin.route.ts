import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { adminController } from "../controllers/admin.controller";
import {
  anylyticsValidator,
  deleteUserValidator,
  getUsersValidator,
  updateUserRoleValidator,
} from "../validators/admin.validator";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/dashboard", adminController.getDashboard);

router.get(
  "/analytics/revenue",
  anylyticsValidator,
  adminController.getRevenueAnalytics,
);

router.get(
  "/analytics/top-products",
  anylyticsValidator,
  adminController.getTopProducts,
);

router.get(
  "/products/low-stock",
  anylyticsValidator,
  adminController.getLowStockProducts,
);
router.patch(
  "/users/:id/role",
  updateUserRoleValidator,
  adminController.updateUserRole,
);

router.get("/users/stats", adminController.getUserStats);

router.get("/users", getUsersValidator, adminController.getAllUsers);

router.delete("/users/:id", deleteUserValidator, adminController.deleteUser);

export default router;
