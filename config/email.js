import nodemailer from "nodemailer";
import {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_SECURE,
} from "./env.js";

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: SMTP_SECURE === "true", // true for 465, false for others
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// Verify connection on startup
transporter
  .verify()
  .then(() => {
    console.log("Email server is ready to send messages");
  })
  .catch((err) => {
    console.error("Email server connection failed:", err);
  });

export default transporter;
