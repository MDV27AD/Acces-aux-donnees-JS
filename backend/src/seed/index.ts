import mysql, { Connection } from "mysql2/promise";
import dotenv from "dotenv";
import { seedProducts } from "./products";
import { faker } from "@faker-js/faker/locale/fr";
import { seedDistributors } from "./distributors";
import { Category, Distributor, Supplier } from "./types";

dotenv.config();

const distributors: Distributor[] = [
  { name: "SPORT SALUT", categories: ["Sport", "Sport Sain"] },
  { name: "GamEZ", categories: ["Jeu vidéo", "Jeu de société"] },
  { name: "MEDIDONC", categories: ["Sport Sain", "Santé"] },
];

const suppliers: Supplier[] = faker.helpers.multiple(faker.company.name, {
  count: { min: 15 - 10, max: 20 - 10 },
});

const categories: Category[] = [
  "Sport",
  "Sport Sain",
  "Santé",
  "Jeu vidéo",
  "Jeu de société",
  ...faker.helpers.multiple(faker.commerce.department, { count: 5 }),
];

const getDatabaseConnection = async (): Promise<Connection> => {
  const dbUri = process.env.DB_URI;
  if (!dbUri) throw "Missing DB_URI";

  return mysql.createConnection(dbUri);
};

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
  const conn = await getDatabaseConnection();
  try {
    console.log("🔮 Truncating tables...");
    await truncateTables(conn);

    console.log("🌱 Seeding database...");

    const products = await seedProducts(conn, suppliers, categories);
    await seedDistributors(conn, distributors);

    console.log(
      `🎉 Seeding complete! Generated a total of 🛒 ${products.length} products for 🚚 ${suppliers.length} suppliers`
    );
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }

  conn.destroy();
  process.exit();
};

seed();
