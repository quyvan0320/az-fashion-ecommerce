import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { addressController } from "../controllers/address.controller";

const router = Router();

router.use(authenticate);

router.get("/", addressController.getAll);

export default router;
