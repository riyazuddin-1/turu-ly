import express from "express";
import { generateShortId } from "./url.controllers.js";
const router = express.Router();

router.get("/", generateShortId);

export default router;
