import express from "express";
import authRoutes from "./modules/auth-manager/auth.routes.js";
import urlRoutes from "./modules/url/url.routes.js";
import qrRoutes from "./modules/qr/qr.routes.js";
import { PORT } from "./shared/config/env.js";
import cors from "./shared/middlewares/cors.js";

const app = express();

app.use(express.json());
app.use(cors);

app.use("/:app/auth", authRoutes); // for auth

app.use("/u", urlRoutes); // for urls
app.use("/qr", qrRoutes); // for qr

app.listen(PORT, () => console.log(`running on ${PORT}`));

/**
 * Auth manager
 * Password manager
 * Network tunnels
 */
