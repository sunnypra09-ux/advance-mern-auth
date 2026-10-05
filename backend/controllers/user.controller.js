import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../models/user.models.js";
import { sendEmail } from "../utils/sendEmail.js";

const generateAccessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });

  return { refreshToken, accessToken };
};

const options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

const signUp = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!(username?.trim() && email?.trim() && password?.trim())) {
    throw new ApiError(400, "All fields are required!!");
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(409, "User Already exists!!");
  }

  const verificationToken = crypto.randomInt(100000, 1000000).toString();
  const verificationTokenExpireAt = Date.now() + 15 * 60 * 1000;

  const hashedVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  const user = await User.create({
    username,
    email,
    password,
    verificationToken: hashedVerificationToken,
    verificationTokenExpireAt,
  });

  const createdUser = await User.findOne({ username }).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating User!!");
  }

  await sendEmail({
    to: user.email,
    subject: "Verify Email",
    html: `<h2>Email Verification</h2>
    <p>Your verification code is:</p>
    <h1>${verificationToken}</h1>
    <p>This code will expire in 15 minutes.</p>`,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { userId: user._id, isVerified: user.isVerified },
        "Registerd successfully. Please verify your email!!",
      ),
    );
});

const signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new ApiError(404, "Invalid email/userame!!");
  }

  const isPasswordValid = await existingUser.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid Password!!");
  }

  if (!existingUser.isVerified) {
    throw new ApiError(400, "Please verify your email first!!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    existingUser._id,
  );

  const loggedInUser = await User.findById(existingUser._id).select(
    "-password -refreshToken",
  );

  if (!loggedInUser) {
    throw new ApiError(500, "Something went wrong while Logging User!!");
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loggedInUser, "User LoggedIn successfully!!"));
});

const signOut = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true },
  );

  if (!user) {
    throw new ApiError(400, "Invalid or expire accessToken!!");
  }

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User LogOut successfully!!"));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { enterCode } = req.body;
  if (!enterCode) {
    throw new ApiError(400, "6-digits code is required!!");
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(enterCode)
    .digest("hex");

  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpireAt: { $gt: Date.now() },
  }).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(400, "Invalid or expire verification Code!!");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpireAt = undefined;

  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, user, "Email verify successfully!!"));
});

const verifyJWT = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies?.accessToken ||
    req.headers?.authorization?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorize - token not provided!!");
  }

  let decodedtoken;

  try {
    decodedtoken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(400, "Invalid or expire acessToken!!");
  }

  const user = await User.findById(decodedtoken._id);

  if (!user) {
    throw new ApiError(400, "Invalid or expire acessToken!!");
  }

  req.user = user;
  next();
});

const checkAuth = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken",
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  console.log(user, "User");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User authenticated successfully"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "email is required!!");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "user not found!!");
  }

  const resetPasswordToken = crypto.randomBytes(30).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetPasswordToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordTokenExpiry = Date.now() + 15 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetPasswordToken}`;

  await sendEmail({
    to: user.email,
    subject: "Reset Password",
    html: `<h2>Password Reset</h2> 
    <p>Hello ${user.username},
    </p> <p>You requested to reset your password.</p> 
    <p>Click the button below to reset your password:</p> 
    <a href="${resetURL}" style=" display:inline-block; padding:10px 20px; background:#007bff; color:white; text-decoration:none; border-radius:5px; " > 
    Reset Password </a> 
    <p>This link will expire in 15 minutes.</p>
     <p>If you did not request this, you can safely ignore this email.</p>`,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "reset-password link send to your mail!!"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  const { token } = req.params;

  if (!newPassword) {
    throw new ApiError(400, "new Password is required!!");
  }
  if (!token) {
    throw new ApiError(400, "token not provided!!");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordTokenExpiry: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expire token!!");
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpiry = undefined;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password update succesfully!!"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { email, username } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "username or email is required!!");
  }

  let updateData = {};
  if (email) updateData.email = email;
  if (username) updateData.username = username;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: updateData,
    },
    { new: true, runValidators: true },
  ).select("-refreshToken -password");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully!!"));
});

export {
  signUp,
  signIn,
  signOut,
  verifyJWT,
  forgotPassword,
  resetPassword,
  verifyEmail,
  checkAuth,
  updateProfile,
};
