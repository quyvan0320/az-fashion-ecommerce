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

//get default = true
router.get("/default", addressController.getDefault);

//get by id
router.get("/:id", addressIdValidator, addressController.getById);

//set default
router.patch("/:id/default", addressIdValidator, addressController.setDefault);

export default router;
