// const asyncHandler = require("../middleware/asyncHandler");

import { asyncHandler } from "../middleware/asyncHandler";
import { BootcampModel } from "../models/Bootcamps";
import { geoCoder } from "../utils/geoCoder";
import { ErrorResponse } from "../utils/errorResponse";

// @desc    Get all bootcamps
// @router  GET /api/v1/bootcamps
// @access  Public
export const getBootcamps = asyncHandler(async (req, res, next) => {
  // Copy Query
  const reqQuery = { ...req.query };
  // Fields to remove
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields to delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);
  // Create string out of query
  let queryStr = JSON.stringify(reqQuery);

  // Create operators for MongoDB ($gt, $gte, $lt, $lte)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  let query = BootcampModel.find(JSON.parse(queryStr));

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const totalDocs = await BootcampModel.countDocuments();
  query = query.skip(startIndex).limit(limit);

  // Running query
  const bootcamps = await query;

  // pagination result
  const pagination = {};
  if (endIndex < totalDocs) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  // Returning response
  res.status(200).send({
    success: true,
    data: bootcamps,
    count: bootcamps.length,
    pagination,
  });
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
  const location = await geoCoder.geocode(zipcode);
  const lat = location[0].latitude;
  const lng = location[0].longitude;

  // Calc radius using radians
  // Divide distance by radius of the Earth
  // Earth radius = 3963 mi / 6378 km
  const radius = distance / 3963;

  const bootcamps = await BootcampModel.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});
