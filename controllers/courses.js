import { asyncHandler } from "../middleware/asyncHandler";
import { CourseModel } from "../models/Course";
import { BootcampModel } from "../models/Bootcamps";
import { geoCoder } from "../utils/geoCoder";
import { ErrorResponse } from "../utils/errorResponse";

// @desc    Get all courses
// @router  GET /api/v1/courses
// @router  GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
export const getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    const courses = await CourseModel.find({ bootcamp: req.params.bootcampId });
    res.status(200).json({
      success: true,
      coount: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get a single course
// @router  GET /api/v1/courses/:id
// @access  Public
export const getCourse = asyncHandler(async (req, res, next) => {
  const course = await CourseModel.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!course) {
    return next(new ErrorResponse("No course exists with provided id.", 404));
  }
  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    Add a course
// @router  POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private
export const addCourse = asyncHandler(async (req, res, next) => {
  req.params.bootcampId = req.body.bootcamp;
  req.body.user = req.user.id;

  const bootcamp = await BootcampModel.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(new ErrorResponse("No bootcamp exists with provided id.", 404));
  }
  // Checking if the user is the owner of the bootcamp
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("Permission Denied", 403));
  }
  const course = await CourseModel.create(req.body);

  res.status(202).json({
    success: true,
    data: course,
  });
});

// @desc    Update a course
// @router  PUT /api/v1/bootcamps/:courseId
// @access  Private
export const updateCourse = asyncHandler(async (req, res, next) => {
  let course = await CourseModel.findById(req.params.id);

  if (!course) {
    return next(new ErrorResponse("No course exists with provided id.", 404));
  }
  // Checking if the user is the owner of the course
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("Permission Denied", 403));
  }
  course = await CourseModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(202).json({
    success: true,
    data: course,
  });
});

// @desc    Delete a course
// @router  DELETE /api/v1/bootcamps/:courseId
// @access  Private
export const deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await CourseModel.findById(req.params.id);
  if (!course) {
    return next(new ErrorResponse("No course exists with provided id.", 404));
  }
  // Checking if the user is the owner of the course
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse("Permission Denied", 403));
  }
  await course.remove();

  res.status(202).json({
    success: true,
  });
});
