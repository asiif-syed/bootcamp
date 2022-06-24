// const asyncHandler = require("../middleware/asyncHandler");

import { asyncHandler } from "../middleware/asyncHandler";
import { BootcampModel } from "../models/Bootcamps";
import { geoCoder } from "../utils/geoCoder";
import { ErrorResponse } from "../utils/errorResponse";

// @desc    Get all bootcamps
// @router  GET /api/v1/bootcamps
// @access  Public
export const getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await BootcampModel.find();
  res
    .status(200)
    .send({ success: true, data: bootcamps, count: bootcamps.length });
});

// @desc    Get a single bootcamp
// @router  GET /api/v1/bootcamps/:id
// @access  Public
export const getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampModel.findById(req.params.id);
  if (!bootcamp) {
    const err = new ErrorResponse("Bootcamp not found with provided id", 404);
    return next(err);
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Get a new bootcamp
// @router  POST /api/v1/bootcamps
// @access  Private
export const createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampModel.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

// @desc    Update a single bootcamp
// @router  PUT /api/v1/bootcamps/:id
// @access  Private
export const updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!bootcamp) {
    const err = new ErrorResponse("Bootcamp not found with provided id", 404);
    return next(err);
  }
  res.status(201).json({ success: true, data: bootcamp });
});

// @desc    Delete a single bootcamp
// @router  DELETE /api/v1/bootcamps/:id
// @access  Private
export const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampModel.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    const err = new ErrorResponse("Bootcamp not found with provided id", 404);
    return next(err);
  }
  res.status(201).json({ success: true, data: {} });
});

// @desc    Get Bootcamps within a radius
// @router  DELETE /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Public
export const getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lot/lon from geoCoder
  const location = await geoCoder.geoCode(zipcode);
  const lat = location[0].latitude;
});
