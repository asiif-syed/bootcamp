import express from "express";
import {
  bootcampPhotoUpload,
  createBootcamp,
  deleteBootcamp,
  getBootcamp,
  getBootcamps,
  getBootcampsInRadius,
  updateBootcamp,
} from "../controllers/bootcamps";
// Importing other resource routers
import { advancedResults } from "../middleware/advancedResults";
import { BootcampModel } from "../models/Bootcamps";

import courseRouter from "./courses";

const router = express.Router();

// Re-routing to other resource routers
router.use("/:bootcampId/courses", courseRouter);

router.get("/", advancedResults(BootcampModel, "courses"), getBootcamps);

router.get("/:id", getBootcamp);

router.post("/", createBootcamp);

router.put("/:id", updateBootcamp);

router.delete("/:id", deleteBootcamp);

router.get("/radius/:zipcode/:distance", getBootcampsInRadius);

router.put("/:id/photo", bootcampPhotoUpload);

export default router;
