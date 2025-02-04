import { faker } from "@faker-js/faker/locale/fr";
import { Connection } from "mysql2/promise";

export const seedProducts = async (conn: Connection) => {
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

  const products: object[] = [];
  for (const supplier of suppliers) {
    const product = faker.helpers.multiple(
      () => ({
        supplier,
        category: faker.helpers.arrayElement(categories),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.number.int({ min: 1_00, max: 800_00 }),
      }),
      {
        count: { min: 30, max: 50 },
      }
    );

    products.push(product);
  }

  console.dir({ suppliers, categories, products }, { depth: Infinity });
};
