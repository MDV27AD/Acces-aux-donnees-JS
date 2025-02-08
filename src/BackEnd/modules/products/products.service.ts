import { Connection, RowDataPacket } from "mysql2/promise";
import { ResultPromise } from "../types";
import { UpdateProductData } from "./schemas/update-product.schema";

interface DatabaseProduct {
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

export default (conn: Connection) => {
  async function findAll(): ResultPromise<DatabaseProduct[]> {
    try {
      const [[products]] = await conn.execute<RowDataPacket[][]>(
        `CALL get_all_products()`
      );

      return [products as DatabaseProduct[], true];
    } catch (err) {
      console.error("Error while querrying all products:", err);
    }

    return [null, false];
  }

  async function findOne(id: number): ResultPromise<DatabaseProduct> {
    try {
      const [[[product]]] = await conn.execute<RowDataPacket[][]>(
        `CALL get_product(:id)`,
        { id }
      );

      return [product as DatabaseProduct, true];
    } catch (err) {
      console.error(`Error while querrying product with id "${id}":`, err);
    }

    return [null, false];
  }

  async function deleteProduct(serialNumber: number): ResultPromise<string> {
    try {
      const [[[{ category }]]] = await conn.execute<RowDataPacket[][]>(
        "CALL delete_product(:serialNumber)",
        {
          serialNumber,
        }
      );

      return [category as string, true];
    } catch (err) {
      console.error(
        `Error while deleting product with serial number "${serialNumber}":`,
        err
      );
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
          sku: data.sku,
          name: data.name,
          description: data.description,
          price: data.price,
          status: data.status,
          category: data.category,
          supplier: data.supplier,
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
