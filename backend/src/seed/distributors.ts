import { Connection, RowDataPacket } from "mysql2/promise";
import { Distributor } from "./types";

export const seedDistributors = async (
  conn: Connection,
  distributors: Distributor[]
) => {
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
  }
};
