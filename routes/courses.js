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

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  advancedResults(CourseModel, {
    path: "bootcamp",
    select: "name description",
  }),
  getCourses
);
router.post("/", addCourse);
router.get("/:id", getCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

export default router;
