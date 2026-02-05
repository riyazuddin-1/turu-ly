import { checkUsername } from "../../helpers/username.js";
import JWT from "../../shared/services/jwt.js";
import { isAlphaNumeric } from "../../shared/utils/index.js";

const jwt = JWT();

export const validateLogin = (req, res, next) => {
  const { username, email } = req.body;
  const { app } = req.params;

  if (!username && !email) {
    return res.status(400).json({
      success: false,
      message: "Username or email is required",
    });
  }

  if (!app) {
    return res.status(400).json({
      success: false,
      message: "App name is required in params",
    });
  }

  next();
};

export const validateSignup = (req, res, next) => {
  const { username, email, name, first_name } = req.body;
  const { app } = req.params;

  if (!username && !email) {
    return res.status(400).json({
      success: false,
      message: "Username or email is required",
    });
  }

  if (!app) {
    return res.status(400).json({
      success: false,
      message: "App name is required in params",
    });
  }

  if (!name && !first_name) {
    return res.status(400).json({
      success: false,
      message: "User's name is required",
    });
  }

  next();
};

export const validateUsername = (req, res, next) => {
  const { username } = req.body;
  const { app } = req.params;

  if (!username) {
    return res.status(400).json({
      success: false,
      message: "Username is required",
    });
  }

  if (!app) {
    return res.status(400).json({
      success: false,
      message: "App name is required in params",
    });
  }

  if (!isAlphaNumeric(username)) {
    return res.status(400).json({
      success: false,
      message: "Username is invalid",
    });
  }

  next();
};

export const validateToken = (req, res, next) => {
  const token = req?.headers?.authorization || req.headers?.["access-token"];
  if (!jwt.verify(token)) {
    return res.status(401).json({
      success: false,
      message: "Token is invalid",
    });
  }

  req.user = jwt.decode(token);
  next();
};

export const validateUserUpdate = async (req, res, next) => {
  const payload = req.body;
  const { app, username } = req.user;
  if (!payload) {
    return res.status(400).json({
      success: false,
      message: "Update fields cannot be empty",
    });
  }

  if (payload.password) {
    return res.status(400).json({
      success: false,
      message: "Use 'forgot-password' for updating password field",
    });
  }

  if (!app) {
    return res.status(400).json({
      success: false,
      message: "App name is missing in token",
    });
  }

  if (payload.username && payload.username !== username) {
    const found = await checkUsername(app, payload.username);
    if (found) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }
  }

  next();
};

export const validateForgotPassword = (req, res, next) => {
  const { app, email } = req.body;

  if (!app) {
    return res.status(400).json({
      success: false,
      message: "App name is required in body",
    });
  }

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  next();
};

export const validateChangePassword = (req, res, next) => {
  const { app, newPassword, userVerificationId, verificationCode } = req.body;

  if (!app) {
    return res.status(400).json({
      success: false,
      message: "App name is required in body",
    });
  }

  if (!newPassword) {
    return res.status(400).json({
      success: false,
      message: "New password is required",
    });
  }

  if (!userVerificationId || !verificationCode) {
    return res.status(400).json({
      success: false,
      message: "Verification id and code are required",
    });
  }

  if (typeof newPassword !== "string" || newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 6 characters long",
    });
  }

  next();
};

export const validateVerifyAccount = (req, res, next) => {
  const { user_verification_id, verification_code, app } = req.query;

  if (!app) {
    return res.status(400).json({
      success: false,
      message: "App name is required in query",
    });
  }

  if (!user_verification_id || !verification_code) {
    return res.status(400).json({
      success: false,
      message: "Verification id and code are required",
    });
  }

  next();
};
