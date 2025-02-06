import Express from "express";
import "./config";
import { pool } from "./database";
import modules from "./modules";

const port = process.env.PORT || 3000;
const app = Express();

modules.forEach((module) => {
  const { path, router } = module(pool);

  app.use(path, router);

  console.log(`⚡ Served module ${path}`);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
