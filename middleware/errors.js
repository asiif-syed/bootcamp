import { ErrorResponse } from "../utils/errorResponse";

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  //   Mongoose Bad Request
  if (err.name === "CastError") {
    const message = `Bootcamp not found with provided id.`;
    error = new ErrorResponse(message, 400);
  }
  //   Mongoose duplication error
  if (err.code === 11000) {
    const message = `Duplicate value is provided`;
    error = new ErrorResponse(message, 400);
  }
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  console.log("🚀 ~ file: errors.js ~ line 19 ~ errorHandler ~ error", error);
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message,
  });
};
