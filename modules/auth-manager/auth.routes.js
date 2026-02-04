import express from "express";
import {
  validateLogin,
  validateSignup,
  validateToken,
  validateUsername,
  validateUserUpdate,
} from "./auth.middlewares.js";
import {
  loginHandler,
  signupHandler,
  verifyUsername,
  updateUser,
} from "./auth.controllers.js";

const router = express.Router();

router.post("/login", validateLogin, loginHandler);

router.post("/signup", validateSignup, signupHandler);

router.post("/username", validateUsername, verifyUsername);

router.put("/user", validateToken, validateUserUpdate, updateUser);

export default router;
