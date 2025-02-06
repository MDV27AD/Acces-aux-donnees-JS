import { Connection, RowDataPacket } from "mysql2/promise";
import { ResultPromise } from "src/BackEnd/types";

interface Product {
  sku: string;
  name: string;
  serial_number: number;
  description: string;
  price: number;
  status: "";
  supplier: string;
  category: string;
}

const SELECT_PRODUCT = `
SELECT 
  p.sku,
  p.name, 
  p.serial_number, 
  p.description, 
  p.price, 
  p.status,
  s.name AS supplier,
  c.name AS category
FROM product p

LEFT JOIN category c
ON c.id = p.id_category

LEFT JOIN supplier s
ON s.id = p.id_supplier
`;

export default (conn: Connection) => {
  async function findAll(limit: number): ResultPromise<Product[]> {
    try {
      const [products] = await conn.execute<RowDataPacket[]>(`
            ${SELECT_PRODUCT}
            ${limit ? "LIMIT " + limit : ""}
            `);

      return [products as Product[], true];
    } catch (err) {
      console.error("Error while querrying all products:", err);
    }

    return [null, false];
  }

  async function findOne(id: number): ResultPromise<Product> {
    try {
      const [[product]] = await conn.execute<RowDataPacket[]>(
        `
        ${SELECT_PRODUCT}
        WHERE p.id = :id
        `,
        { id }
      );

      return [product as Product, true];
    } catch (err) {
      console.error(`Error while querrying product with id "${id}":`, err);
    }

    return [null, false];
  }

  return {
    findAll,
    findOne,
  };
};
