import dotenv from "dotenv";
dotenv.config();

import Express from "express";
import { createPool } from "mysql2/promise";
import { getDatabaseConfig } from "./database";
import modules from "./modules";
import cors from "cors";

const port = process.env.BACKEND_PORT || 3000;
const app = Express();
app.use(
  cors({
    origin: "*",
    optionsSuccessStatus: 200, // For legacy browser support
    credentials: true,
    maxAge: 3600,
  })
);

function run() {
  const pool = createPool(getDatabaseConfig("app"));

  modules.forEach((module) => {
    const { path, router } = module(pool);

    app.use(path, router);

    console.log(`⚡ Served module ${path}`);
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
run();
