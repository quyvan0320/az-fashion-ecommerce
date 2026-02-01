import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { addressController } from "../controllers/address.controller";
import {
  addressInputValidator,
  addressUpdateValidator,
} from "../validators/address.validator";

const router = Router();

router.use(authenticate);

// get all
router.get("/", addressController.getAll);

// create
router.post("/", addressInputValidator, addressController.create);

//update
router.put("/:id", addressUpdateValidator, addressController.update);

export default router;
