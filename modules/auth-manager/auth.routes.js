import express from "express";
import {
  validateChangePassword,
  validateForgotPassword,
  validateLogin,
  validateSignup,
  validateToken,
  validateUsername,
  validateUserUpdate,
  validateVerifyAccount,
} from "./auth.middlewares.js";
import {
  loginHandler,
  signupHandler,
  verifyUsername,
  updateUser,
  verifyAccount,
  changePassword,
  forgotPassword,
} from "./auth.controllers.js";

const router = express.Router();

router.post("/login", validateLogin, loginHandler);

router.post("/signup", validateSignup, signupHandler);

router.post("/username", validateUsername, verifyUsername);

router.get("/verify", validateVerifyAccount, verifyAccount);

router.post(
  "/forgot-password",
  validateToken,
  validateForgotPassword,
  forgotPassword,
);

router.post(
  "/change-password",
  validateToken,
  validateChangePassword,
  changePassword,
);

router.put("/user", validateToken, validateUserUpdate, updateUser);

export default router;
