import { Connection, RowDataPacket } from "mysql2/promise";
import { Distributor } from "./types";
import { distributors } from ".";

export const seedDistributors = async (conn: Connection) => {
  for (const distributor of distributors) {
    await conn.execute(
      `
        INSERT INTO distributor (name)
        VAlUES (:name)
    `,
      {
        name: distributor.name,
      }
    );

    const [[{ id: distributorId }]] = await conn.execute<RowDataPacket[]>(
      `
      SELECT id
      FROM distributor
      WHERE name = :name
    `,
      { name: distributor.name }
    );

    const categoriesIds: number[] = await Promise.all(
      distributor.categories.map(async (category) => {
        const [[{ id: categoryId }]] = await conn.execute<RowDataPacket[]>(
          `
          SELECT id
          FROM category
          WHERE name = :category
        `,
          { category }
        );

        return categoryId;
      })
    );

    await Promise.all(
      categoriesIds.map((categoryId) =>
        conn.execute(
          `
            INSERT INTO category_distributor (id_category, id_distributor)
            VALUES (:categoryId, :distributorId)
        `,
          {
            categoryId,
            distributorId,
          }
        )
      )
    );

    console.log(
      `🔗 Associated 💵 distributor ${distributor.name} with its categories: ${distributor.categories.join(", ")}`
    );

    const [products] = await conn.execute<RowDataPacket[]>(`
      SELECT
        p.sku,
        p.name,
        p.serial_number as serialNumber,
        p.description,
        p.price,
        p.status,
        c.name as category,
        s.name as supplierName,
        s.id as supplierId,
        s.created_at as supplierCreatedAt
      FROM product p

      JOIN supplier s
      ON p.id_supplier = s.id

      JOIN category c
      ON p.id_category = c.id
      `);

    console.log(
      `🥭 Deleting products from distributor's mongo db:`,
      distributor.name
    );

    await fetch(distributor.mongoUrl, { method: "DELETE" });

    const distributorProducts = products.filter((p) =>
      distributor.categories.includes(p.category)
    );

    console.log(
      `🥭 Sending 🛒 x${distributorProducts.length} products to distributor's mongo db:`,
      distributor.name
    );
    for (const product of distributorProducts) {
      const mongoProduct = {
        ...product,
        stocked: product.status === "available" ? true : false,
      };

      await fetch(distributor.mongoUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mongoProduct),
      });
    }

    console.log(
      `🥭 Sent 🛒 x${distributorProducts.length} products to distributor's mongo db`
    );
  }
};
