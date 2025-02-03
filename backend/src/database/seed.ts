import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbUri = process.env.DB_URI;
if (!dbUri) throw "Missing DB_URI";

const pool = mysql.createPool(dbUri);

async function seedDatabase() {
  const connection = await pool.getConnection();
  try {
    console.log("🌱 Seeding database...");

    const [distributors] = await connection.query(
      `INSERT INTO distributor (name) VALUES 
			('Distributor A'), ('Distributor B'), ('Distributor C')
			ON DUPLICATE KEY UPDATE name = VALUES(name);`
    );
    console.log(`✅ Inserted distributors:`, distributors);

    const [categories] = await connection.query(
      `INSERT INTO category (name) VALUES 
			('Electronics'), ('Clothing'), ('Home Appliances')
			ON DUPLICATE KEY UPDATE name = VALUES(name);`
    );
    console.log(`✅ Inserted categories:`, categories);

    const [products] = await connection.query(
      `INSERT INTO product (sku, serial_number, name, description, price, distributor_id) VALUES
			('PROD001', 10001, 'Smartphone', 'A high-end smartphone.', 69999, 1),
			('PROD002', 10002, 'Laptop', 'A powerful gaming laptop.', 129999, 1),
			('PROD003', 10003, 'T-Shirt', 'A stylish T-shirt.', 1999, 2)
			ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), price = VALUES(price);`
    );
    console.log(`✅ Inserted products:`, products);

    const [productCategories] = await connection.query(
      `INSERT INTO product_category (product_id, category_id) VALUES
			(1, 1),
			(2, 1),
			(3, 2) 
			ON DUPLICATE KEY UPDATE product_id = VALUES(product_id), category_id = VALUES(category_id);`
    );
    console.log(`✅ Inserted product-category relations:`, productCategories);

    console.log("🎉 Seeding complete!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }

  connection.release();
  process.exit();
}

seedDatabase();
