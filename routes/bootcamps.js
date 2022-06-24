import express from "express";
import {
  createBootcamp,
  deleteBootcamp,
  getBootcamp,
  getBootcamps,
  updateBootcamp,
} from "../controllers/bootcamps";

const router = express.Router();

router.get("/", getBootcamps);

router.get("/:id", getBootcamp);

router.post("/", createBootcamp);

router.put("/:id", updateBootcamp);

router.delete("/:id", deleteBootcamp);

export default router;
