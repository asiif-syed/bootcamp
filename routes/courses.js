import express from "express";
import {
  addCourse,
  deleteCourse,
  getCourse,
  getCourses,
  updateCourse,
} from "../controllers/courses";
import { CourseModel } from "../models/Course";
import { advancedResults } from "../middleware/advancedResults";
import { authorize, isAuthenticated } from "../middleware/auth";

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  advancedResults(CourseModel, {
    path: "bootcamp",
    select: "name description",
  }),
  getCourses
);
router.post("/", isAuthenticated, authorize("publisher", "admin"), addCourse);
router.get("/:id", getCourse);
router.put(
  "/:id",
  isAuthenticated,
  authorize("publisher", "admin"),
  updateCourse
);
router.delete(
  "/:id",
  isAuthenticated,
  authorize("publisher", "admin"),
  deleteCourse
);

export default router;
