import { faker } from "@faker-js/faker/locale/fr";
import { Connection, RowDataPacket } from "mysql2/promise";
import { Category, Supplier } from "./types";
import { categories, suppliers } from ".";

export const seedProducts = async (conn: Connection) => {
  for (const supplier of suppliers) {
    const products = await Promise.all(
      faker.helpers.multiple(
        async () => {
          const category = faker.helpers.arrayElement(categories);
          const sku = faker.string.alphanumeric({ casing: "upper", length: 8 });
          const serialNumber = faker.number.int({ max: 4294967295 - 1 });
          const name = faker.commerce.productName();
          const description = faker.commerce.productDescription();
          const price = faker.number.int({ min: 1_00, max: 655_35 });

          await conn.execute(
            `CALL add_product(
                  :sku,
                  :serialNumber,
                  :name,
                  :description,
                  :price,
                  :category,
                  :supplier
                )`,
            {
              supplier,
              category,
              sku,
              serialNumber,
              name,
              description,
              price,
            }
          );
        },
        {
          count: { min: 30, max: 50 },
        }
      )
    );

    console.log(
      `🛒 Generated x${products.length} products for supplier: ${supplier}`
    );
  }
};
