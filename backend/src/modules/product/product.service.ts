import { Inject, Injectable } from "@nestjs/common";
import { Pool, RowDataPacket } from "mysql2/promise";
import { MYSQL_CONNECTION } from "../database.module";

@Injectable()
export class ProductService {
  constructor(@Inject(MYSQL_CONNECTION) private readonly db: Pool) {}

  private formatProduct(p: object) {
    return {
      ...p,
      ...("categories" in p
        ? { categories: (p.categories as string).split(",") }
        : {}),
    };
  }

  async findAll() {
    const [products] = await this.db.query<RowDataPacket[]>(
      `
      SELECT *
      FROM product
    `
    );

    return products.map(this.formatProduct);
  }

  async findOne(id: string) {
    const [rows] = await this.db.execute(
      `SELECT 
              p.product_id, 
              p.sku, 
              p.serial_number, 
              p.name AS product_name, 
              p.description, 
              p.price, 
              p.status, 
              p.created_at, 
              p.updated_at, 
              d.name AS distributor_name,
              GROUP_CONCAT(c.name) AS categories
            FROM product p
            JOIN distributor d ON d.distributor_id = p.distributor_id
            LEFT JOIN product_category pc ON pc.id = p.product_id
            LEFT JOIN category c ON c.category_id = pc.id
            WHERE p.product_id = ?
            GROUP BY p.product_id`,
      [id]
    );

    return this.formatProduct(rows[0]);
  }
}
