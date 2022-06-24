const asyncHandler = require("../middleware/asyncHandler");
const BootcampModel = require("../models/Bootcamps");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get all bootcamps
// @router  GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await BootcampModel.find();
  res
    .status(200)
    .send({ success: true, data: bootcamps, count: bootcamps.length });
});

// @desc    Get a single bootcamp
// @router  GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
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
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampModel.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

// @desc    Update a single bootcamp
// @router  PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
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
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampModel.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    const err = new ErrorResponse("Bootcamp not found with provided id", 404);
    return next(err);
  }
  res.status(201).json({ success: true, data: {} });
});
