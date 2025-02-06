import { Connection, RowDataPacket } from "mysql2/promise";
import { ResultPromise } from "../types";
import { UpdateProductData } from "./schemas/update-product.schema";

interface Product {
  id: number;
  sku: string;
  name: string;
  serial_number: number;
  description: string;
  price: number;
  status: "available" | "out_of_stock";
  supplier: string;
  supplierId: string;
  category: string;
}

const SELECT_PRODUCT = `
SELECT 
  p.id,
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
  async function findAll(): ResultPromise<Product[]> {
    try {
      const [products] = await conn.execute<RowDataPacket[]>(
        `CALL get_all_products()`
      );

      return [products as Product[], true];
    } catch (err) {
      console.error("Error while querrying all products:", err);
    }

    return [null, false];
  }

  async function findOne(id: number): ResultPromise<Product> {
    try {
      const [[product]] = await conn.execute<RowDataPacket[]>(
        `CALL get_product(:id)`,
        { id }
      );

      return [product as Product, true];
    } catch (err) {
      console.error(`Error while querrying product with id "${id}":`, err);
    }

    return [null, false];
  }

  async function deleteProduct(id: number): ResultPromise<null> {
    try {
      await conn.execute("CALL delete_product(:id)", { id });

      return [null, true];
    } catch (err) {
      console.error(`Error while deleting product with id "${id}":`, err);
    }

    return [null, false];
  }

  async function updateProduct(
    id: number,
    data: UpdateProductData
  ): ResultPromise<null> {
    try {
      await conn.execute(
        `
        CALL modify_product(
          :id,
          :sku,
          :serialNumber,
          :name,
          :description,
          :price,
          :status,
          :category,
          :supplier
        )
        `,
        {
          id,
          ...data,
        }
      );

      return [null, true];
    } catch (err) {
      console.error(`Error while updating product with id "${id}":`, err, data);
    }

    return [null, false];
  }

  return {
    findAll,
    findOne,
    deleteProduct,
    updateProduct,
  };
};
