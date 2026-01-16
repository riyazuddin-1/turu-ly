import express from "express";
import { validateUrl, validateShortId } from "./url.middlewares.js";
import { generateShortId, forwardToUrl } from "./url.controllers.js";
const router = express.Router();

router.post("/generate", validateUrl, generateShortId);

router.get("/:short", validateShortId, forwardToUrl);

export default router;
