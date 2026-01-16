import express from "express";
import { getQR } from "./qr.controllers.js";
import { validateData } from "./qr.middlewares.js";

const router = express.Router();

router.get("/", validateData, getQR);

export default router;
