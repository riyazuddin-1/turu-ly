import { ObjectId } from "mongodb";
import crypto from "crypto";
import Database from "../shared/services/db.js";
import EmailService from "../shared/services/email.service.js";
import { BASE_URL } from "../config/env.js";

const Users = new Database("vector", "users");
const Verifications = new Database("vector", "verifications");

const emailService = new EmailService("No Reply <noreply@yourapp.com>");

/**
 * name + mongodb id (without timestamp) + timestamp extracted from ObjectId
 */
export const buildUserVerificationId = (user) => {
  const objectId = new ObjectId(user.userid);

  const hex = objectId.toHexString();
  const timestampHex = hex.substring(0, 8);
  const restHex = hex.substring(8);

  const timestamp = parseInt(timestampHex, 16);

  const name =
    user.name || `${user.first_name || ""}${user.last_name || ""}`.trim();

  return `${name}_${restHex}_${timestamp}`;
};

/**
 * Reconstruct ObjectId from user_verification_id
 */
export const reconstructUserId = (user_verification_id) => {
  const parts = user_verification_id.split("_");

  if (parts.length < 3) return null;

  const restHex = parts[parts.length - 2];
  const timestamp = Number(parts[parts.length - 1]);

  if (Number.isNaN(timestamp)) return null;

  const timestampHex = timestamp.toString(16).padStart(8, "0");
  const objectIdHex = `${timestampHex}${restHex}`;

  if (objectIdHex.length !== 24) return null;

  return new ObjectId(objectIdHex);
};

/**
 * Generic verification creator (email verification, password reset, etc.)
 */
export const createVerification = async ({
  user,
  type,
  emailSubject,
  emailTemplate,
  redirectPath,
}) => {
  if (!user?.email || !user?.userid || !user?.app) {
    throw new Error("Missing required user fields");
  }

  const verification_code = crypto.randomInt(100000, 999999).toString();
  const user_verification_id = buildUserVerificationId(user);

  await Verifications.insertOne({
    app: user.app,
    userId: new ObjectId(user.userid),
    email: user.email,
    user_verification_id,
    verification_code,
    type,
    isUsed: false,
  });

  const link = `${BASE_URL}${redirectPath}?user_verification_id=${encodeURIComponent(
    user_verification_id,
  )}&verification_code=${verification_code}&app=${user.app}`;

  const html = emailTemplate({ link, user });

  await emailService.sendMail({
    to: user.email,
    subject: emailSubject,
    html,
  });

  return {
    user_verification_id,
  };
};

/**
 * Generic verification consumer
 */
export const consumeVerification = async ({
  app,
  user_verification_id,
  verification_code,
  type,
}) => {
  if (!app || !user_verification_id || !verification_code || !type) {
    const err = new Error("Missing verification parameters");
    err.status = 400;
    throw err;
  }

  const verification = await Verifications.findOne({
    app,
    user_verification_id,
    verification_code,
    type,
    isUsed: false,
  });

  if (!verification) {
    const err = new Error("Invalid or expired verification link");
    err.status = 400;
    throw err;
  }

  await Verifications.updateOne(
    { _id: verification._id },
    { $set: { isUsed: true } },
  );

  return {
    valid: true,
    userId: verification.userId,
    verification,
  };
};

// ----- Email verification ----- //

export const sendEmailVerification = (user) =>
  createVerification({
    user,
    type: "email_verification",
    redirectPath: "/verify",
    emailSubject: "Verify your account",
    emailTemplate: ({ link }) => `
      <h2>Verify your account</h2>
      <a href="${link}">Verify Account</a>
    `,
  });

export const verifyEmailAccount = async (payload) => {
  const { userId } = await consumeVerification({
    ...payload,
    type: "email_verification",
  });

  await Users.updateOne(
    { _id: userId, app: payload.app },
    { $set: { isVerified: true } },
  );

  return {
    verified: true,
    userId,
  };
};

// ----- Password verification ----- //

export const sendPasswordResetEmail = (user) =>
  createVerification({
    user,
    type: "password_change",
    redirectPath: "/reset-password",
    emailSubject: "Reset your password",
    emailTemplate: ({ link }) => `
      <h2>Password Reset</h2>
      <p>Click below to reset your password:</p>
      <a href="${link}">Reset Password</a>
    `,
  });

export const verifyPasswordReset = async (payload) => {
  const { userId } = await consumeVerification({
    ...payload,
    type: "password_change",
  });

  return {
    resetAllowed: true,
    userId,
  };
};
