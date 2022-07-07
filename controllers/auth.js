import { asyncHandler } from "../middleware/asyncHandler";
import { UserModel } from "../models/User";
import { ErrorResponse } from "../utils/errorResponse";
import { sendTokenResponse } from "../utils/sendTokenResponse";

// @desc    Register a new user
// @router  POST /api/v1/auth/register
// @access  Public
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const user = await UserModel.create({
    name,
    email,
    password,
    role,
  });
  sendTokenResponse(user, 201, res);
});

// @desc    Login a user
// @router  POST /api/v1/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // Validate email & Password
  if (!email || !password) {
    return next(new ErrorResponse("Email and Password are required.", 400));
  }

  // Check for user
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse("Invalid credentials.", 401));
  }
  // Validate password
  const validPassword = await user.validatePassword(password);
  if (!validPassword) {
    return next(new ErrorResponse("Invalid credentials.", 401));
  }
  sendTokenResponse(user, 201, res);
});

// @desc    Get current logged in user
// @router  GET /api/v1/auth/get-user
// @access  Private
export const getLoggedinUser = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user.id);

  res.status(200).json({ success: true, data: user });
});

// @desc    Forgot Password
// @router  POST /api/v1/auth/forgotpassword
// @access  Public
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("No user found with provided email.", 400));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  res.status(200).json({ success: true, data: user });
});

// @desc    Logout
// @router  get /api/v1/auth/logout
// @access  Public
export const logout = asyncHandler(async (req, res, next) => {
res.cookie('token', "none", {
  expires: new Date(Date.now() + 10 * 1000),
  httpsOnly: true
}) 
  res.status(200).json({ success: true, data:{} });
});
