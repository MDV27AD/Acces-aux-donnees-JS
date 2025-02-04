import { faker } from "@faker-js/faker/locale/fr";
import { Connection } from "mysql2/promise";

export const seedProducts = async (
  conn: Connection
): Promise<[number, number]> => {
  conn.config.namedPlaceholders = true;
  const suppliers: string[] = faker.helpers.multiple(faker.company.name, {
    count: { min: 15, max: 20 },
  });

  const categories = [
    "Sport",
    "Sport Sain",
    "Santé",
    "Jeu vidéo",
    "Jeu de société",
    ...faker.helpers.multiple(faker.commerce.department, { count: 5 }),
  ];

  let productsCount: number = 0;
  for (const supplier of suppliers) {
    const products = faker.helpers.multiple(
      () => ({
        supplier,
        category: faker.helpers.arrayElement(categories),
        sku: faker.string.alphanumeric({ casing: "upper", length: 8 }),
        serialNumber: faker.number.int({ max: 4294967295 - 1 }),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.number.int({ min: 1_00, max: 655_35 }),
      }),
      {
        count: { min: 30, max: 50 },
      }
    );

    for (const {
      sku,
      serialNumber,
      name,
      description,
      price,
      category,
      supplier,
    } of products) {
      await conn.execute(
        `CALL add_product(
                :new_sku,
                :new_serial_number,
                :new_name,
                :new_description,
                :new_price,
                :new_category,
                :new_supplier
                )`,
        {
          new_sku: sku,
          new_serial_number: serialNumber,
          new_name: name,
          new_description: description,
          new_price: price,
          new_category: category,
          new_supplier: supplier,
        }
      );

      productsCount++;
    }

    console.log(
      `🛒 Generated x${products.length} products for supplier "${supplier}"`
    );
  }

  return [productsCount, suppliers.length];
};
