import express from "express";
import urlRoutes from "./modules/url/url.routes.js";
import { PORT } from "./shared/config/env.js";

const app = express();

app.use("/url", urlRoutes);

app.listen(PORT, () => console.log(`running on ${PORT}`));
