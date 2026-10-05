import { Router } from "express";
const router = Router();

import {
  signUp,
  signIn,
  signOut,
  verifyJWT,
  forgotPassword,
  resetPassword,
  verifyEmail,
  checkAuth,
  updateProfile,
} from "../controllers/user.controller.js";

router.route("/sign-up").post(signUp);
router.route("/sign-in").post(signIn);

// protected routes
router.route("/sign-out").post(verifyJWT, signOut);
router.route("/verify-email").post(verifyEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/check-auth").post(verifyJWT, checkAuth);
router.route("/update-profile").patch(verifyJWT, updateProfile);

export { router };
