import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { addressController } from "../controllers/address.controller";
import {
  addressIdValidator,
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

//get by id
router.get("/:id", addressIdValidator, addressController.getById);

export default router;
