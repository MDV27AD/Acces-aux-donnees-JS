import { faker } from "@faker-js/faker/locale/fr";
import { Connection } from "mysql2/promise";
import { Category, Product, Supplier } from "./types";

export const seedProducts = async (
    conn: Connection,
    suppliers: Supplier[],
    categories: Category[]
): Promise<Product[]> => {
    const allProducts: Product[] = [];
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
                            sku,
                            serialNumber,
                            name,
                            description,
                            price,
                            category,
                            supplier,
                        }
                    );

                    allProducts.push({
                        supplier,
                        category,
                        sku,
                        serialNumber,
                        name,
                        description,
                        price,
                    });
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

    return allProducts;
};