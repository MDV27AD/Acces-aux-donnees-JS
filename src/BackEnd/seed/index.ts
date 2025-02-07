import dotenv from "dotenv";
dotenv.config();

import { faker } from "@faker-js/faker/locale/fr";
import { Connection, createConnection } from "mysql2/promise";
import { seedDistributors } from "./distributors";
import { seedProducts } from "./products";
import { Supplier } from "./types";
import { getDatabaseConfig } from "../database";

export const suppliers: Supplier[] = faker.helpers.multiple(
  faker.company.name,
  {
    count: { min: 15, max: 20 },
  }
);

const truncateTables = async (conn: Connection) => {
  await conn.query("SET FOREIGN_KEY_CHECKS = 0;");
  await Promise.all(
    [
      "supplier",
      "product",
      "category_distributor",
      "category",
      "distributor",
    ].map((table) => conn.query(`TRUNCATE ${table}`))
  );
  await conn.query("SET FOREIGN_KEY_CHECKS = 1;");
};

const seed = async () => {
  const conn = await createConnection(getDatabaseConfig("seeder"));
  try {
    console.log("🔮 Truncating tables...");
    await truncateTables(conn);

    console.log("🌱 Seeding database...");

    await seedProducts(conn);
    await seedDistributors(conn);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }

  conn.destroy();
  process.exit();
};

seed();
