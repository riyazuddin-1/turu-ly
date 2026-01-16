import express from "express";
import urlRoutes from "./modules/url/url.routes.js";
import qrRoutes from "./modules/qr/qr.routes.js";
import { PORT } from "./shared/config/env.js";

const app = express();

app.use("/u", urlRoutes); // for urls

app.use("/qr", qrRoutes);

app.listen(PORT, () => console.log(`running on ${PORT}`));
