import express from "express";
import { validateLogin, validateSignup } from "./auth.middlewares.js";
import {
  loginHandler,
  signupHandler,
  verifyUsername,
  updateUser,
} from "./auth.controllers.js";

const router = express.Router();

router.post("/login", validateLogin, loginHandler);

router.post("/signup", validateSignup, signupHandler);

// pending
router.post("/username", verifyUsername);

router.put("/user", updateUser);

export default router;
