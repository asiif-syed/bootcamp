import { asyncHandler } from "../middleware/asyncHandler";
import { BootcampModel } from "../models/Bootcamps";
import { geoCoder } from "../utils/geoCoder";
import { ErrorResponse } from "../utils/errorResponse";
import path from "path";
// @desc    Get all bootcamps
// @router  GET /api/v1/bootcamps
// @access  Public
export const getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).send(res.advancedResults);
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

// @desc    Add a new bootcamp
// @router  POST /api/v1/bootcamps
// @access  Private
export const createBootcamp = asyncHandler(async (req, res, next) => {
  //  Add user to req.body
  req.body.user = req.user.id;

  // Check for published bootcamps
  const publishedBootcamps = await BootcampModel.findOne({ user: req.user.id });
  // If user is not admin, they can add only one bootcamp
  if (publishedBootcamps && req.user.role !== "admin") {
    return next(
      new ErrorResponse("A bootcamp already exists with this user id", 400)
    );
  }

  const bootcamp = await BootcampModel.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

// @desc    Update a single bootcamp
// @router  PUT /api/v1/bootcamps/:id
// @access  Private
export const updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await BootcampModel.findOne({ id: req.params.id });
  // Checking if the bootcamp exists
  if (!bootcamp) {
    const err = new ErrorResponse("Bootcamp not found with provided id", 404);
    return next(err);
  }

  // Checking if the user is the owner of bootcamp
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("Permission denied.", 403));
  }

  bootcamp = await BootcampModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({ success: true, data: bootcamp });
});

// @desc    Delete a single bootcamp
// @router  DELETE /api/v1/bootcamps/:id
// @access  Private
export const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampModel.findById(req.params.id);

  // Checking if the bootcamp exists
  if (!bootcamp) {
    const err = new ErrorResponse("Bootcamp not found with provided id", 404);
    return next(err);
  }

  // Checking if the user is the owner of bootcamp
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("Permission denied.", 403));
  }

  bootcamp.remove();
  res.status(201).json({ success: true, data: {} });
});

// @desc    Get Bootcamps within a radius
// @router  GET /api/v1/bootcamps/radius/:zipcode/:distance
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

// @desc    Upload a photo for Bootcamp
// @router  PUT /api/v1/bootcamps/:id/photo
// @access  Private
export const bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampModel.findById(req.params.id);
  if (!bootcamp) {
    const err = new ErrorResponse("Bootcamp not found with provided id", 404);
    return next(err);
  }

  // Checking if the user is the owner of bootcamp
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("Permission denied.", 403));
  }

  if (!req.files) {
    const err = new ErrorResponse("Please upload a file.", 400);
    return next(err);
  }
  const file = req.files.file;
  // Verify if the file is an image
  if (!file.mimetype.startsWith("image/")) {
    const err = new ErrorResponse("Please upload a image file.", 400);
    return next(err);
  }

  // Verify file size
  console.log(
    "🚀 ~ file: bootcamps.js ~ line 174 ~ bootcampPhotoUpload ~ file.size",
    file.size
  );
  if (file.size > 1000000) {
    const err = new ErrorResponse(
      "Please upload a image of size less than 100000.",
      400
    );
    return next(err);
  }
  // Create custom file name
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`./public/uploads/${file.name}`, async (err) => {
    if (err) {
      console.log(
        "🚀 ~ file: bootcamps.js ~ line 189 ~ bootcampPhotoUpload ~ err",
        err
      );
      return next(new ErrorResponse("Problem with file upload", 500));
    }

    await BootcampModel.findByIdAndUpdate(req.params.id, { photo: file.name });
    res.status(202).json({ success: true, data: file.name });
  });
});
