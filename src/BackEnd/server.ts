import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import Express from "express";
import { createPool } from "mysql2/promise";
import { getDatabaseConfig } from "./database";
import modules from "./modules";

const port = process.env.BACKEND_PORT || 3000;


function run() {
  const app = Express();
  const pool = createPool(getDatabaseConfig("app"));

  app.use(
    cors({
      origin: "*",
      optionsSuccessStatus: 200, // For legacy browser support
      credentials: true,
      maxAge: 3600,
    })
  );

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
