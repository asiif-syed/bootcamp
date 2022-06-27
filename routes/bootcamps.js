import express from "express";
import {
  createBootcamp,
  deleteBootcamp,
  getBootcamp,
  getBootcamps,
  getBootcampsInRadius,
  updateBootcamp,
} from "../controllers/bootcamps";

const router = express.Router();

router.get("/", getBootcamps);

router.get("/:id", getBootcamp);

router.post("/", createBootcamp);

router.put("/:id", updateBootcamp);

router.delete("/:id", deleteBootcamp);

router.get("/radius/:zipcode/:distance", getBootcampsInRadius);

export default router;
