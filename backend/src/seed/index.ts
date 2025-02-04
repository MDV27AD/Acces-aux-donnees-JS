import mysql, { Connection } from "mysql2/promise";
import dotenv from "dotenv";
import { seedProducts } from "./products";

dotenv.config();

const dbUri = process.env.DB_URI;
if (!dbUri) throw "Missing DB_URI";

const pool = mysql.createPool(dbUri);

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
  const conn = await pool.getConnection();
  try {
    console.log("🔮 Truncating tables...");
    await truncateTables(conn);

    console.log("🌱 Seeding database...");
    const [productsCount, suppliersCount] = await seedProducts(conn);

    console.log(
      `🎉 Seeding complete! Generated a total of 🛒 ${productsCount} products for 🚚 ${suppliersCount} suppliers`
    );
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }

  conn.release();
  process.exit();
};

seed();
