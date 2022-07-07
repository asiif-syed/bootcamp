import jwt from "jsonwebtoken";
import { asyncHandler } from "./asyncHandler";
import { UserModel } from "../models/User";
import { ErrorResponse } from "../utils/errorResponse";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Reading the token from the request -> Authorization (Format will be 'Bearer <Token>')
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(
      new ErrorResponse("Not authorized to access the resource", 401)
    );
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await UserModel.findById(decoded.id);
    next();
  } catch (error) {
    new ErrorResponse("Not authorized to access the resource", 401);
  }
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse("Not authorized to access the resource", 403)
      );
    }
    next();
  };
};
