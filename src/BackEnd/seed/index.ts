import { faker } from "@faker-js/faker/locale/fr";
import dotenv from "dotenv";
import { Connection, createConnection } from "mysql2/promise";
import { seedDistributors } from "./distributors";
import { seedProducts } from "./products";
import { Category, Distributor, Supplier } from "./types";
import { getDatabaseConfig } from "../database";

dotenv.config();

const getDistributorMongoUrl = (identifier: string) =>
  `https://acces-aux-donnees-js-mongodb-${identifier}.onrender.com/products`;
export const distributors: Distributor[] = [
  {
    name: "SPORT SALUT",
    categories: ["Sport", "Sport Sain"],
    mongoUrl: "http://localhost:3061/products", // getDistributorMongoUrl("sport-salut"),
  },
  {
    name: "GamEZ",
    categories: ["Jeu vidéo", "Jeu de société"],
    mongoUrl: getDistributorMongoUrl("gameez"),
  },
  {
    name: "MEDIDONC",
    categories: ["Sport Sain", "Santé"],
    mongoUrl: getDistributorMongoUrl("medidonc"),
  },
];

export const suppliers: Supplier[] = faker.helpers.multiple(
  faker.company.name,
  {
    count: { min: 15, max: 20 },
  }
);

export const categories: Category[] = [
  "Sport",
  "Sport Sain",
  "Santé",
  "Jeu vidéo",
  "Jeu de société",
  ...faker.helpers.multiple(faker.commerce.department, { count: 5 }),
];

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
