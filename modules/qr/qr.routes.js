import express from "express";
import { generateQR } from "./qr.controllers.js";
import { validateData } from "./qr.middlewares.js";

const router = express.Router();

router.post("/", validateData, generateQR);

export default router;
