import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { addressController } from "../controllers/address.controller";
import { addressInputValidator } from "../validators/address.validator";

const router = Router();

router.use(authenticate);

// get all
router.get("/", addressController.getAll);

// create
router.post("/", addressInputValidator, addressController.create);

export default router;
