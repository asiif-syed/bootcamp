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
import { authorize, isAuthenticated } from "../middleware/auth";
import { BootcampModel } from "../models/Bootcamps";

import courseRouter from "./courses";

const router = express.Router();

// Re-routing to other resource routers
router.use("/:bootcampId/courses", courseRouter);

router.get("/", advancedResults(BootcampModel, "courses"), getBootcamps);

router.get("/:id", getBootcamp);

router.post(
  "/",
  isAuthenticated,
  authorize("publisher", "admin"),
  createBootcamp
);

router.put(
  "/:id",
  isAuthenticated,
  authorize("publisher", "admin"),
  updateBootcamp
);

router.delete(
  "/:id",
  isAuthenticated,
  authorize("publisher", "admin"),
  deleteBootcamp
);

router.get("/radius/:zipcode/:distance", getBootcampsInRadius);

router.put(
  "/:id/photo",
  isAuthenticated,
  authorize("publisher", "admin"),
  bootcampPhotoUpload
);

export default router;
