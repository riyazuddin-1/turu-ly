import express from 'express';
import { getQR } from "./qr.controllers.js";

const router = express.Router();

router.get('/', getQR);

export default router;